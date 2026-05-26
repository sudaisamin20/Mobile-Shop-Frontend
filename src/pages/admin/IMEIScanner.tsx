"use client";
// ─────────────────────────────────────────────────────────────────
//  IMEIScanner.tsx  —  Admin IMEI Barcode Scanner Page
//  Package: @zxing/browser  (npm install @zxing/browser @zxing/library)
//
//  Why @zxing/browser over html5-qrcode?
//  ✅ Supports Code-128 barcodes (what IMEI labels use)
//  ✅ Full TypeScript types built-in
//  ✅ Actively maintained by the ZXing team
//  ✅ No jQuery / no hidden iframes
//  ✅ Works on mobile camera (rear + front)
//  ✅ Handles QR codes, barcodes and DataMatrix in one lib
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import {
  ScanBarcode,
  Camera,
  CameraOff,
  RefreshCw,
  ClipboardCopy,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  Info,
  FlipHorizontal,
} from "lucide-react";

// BMZ UI Components
import {
  PageBackground,
  Avatar,
  useToast,
  ToastContainer,
} from "../../components/ui/Misc";
import { Button, Badge, Card, Input, Modal, AnimateIn } from "../../components/ui";
import { DeviceDetailsModal } from "../../components/inventory";
import { Layout } from "../../layout";
import { useInventory } from "../../hooks/useInventory";
import type { ICreateDeviceRequest } from "../../interfaces/inventory";

// ── Types ─────────────────────────────────────

interface ScannedIMEI {
  id: string;
  imei: string;
  scannedAt: string;
  method: "camera" | "manual";
  valid: boolean;
  brand?: string;
}

// ── IMEI Validation (Luhn algorithm) ─────────

function validateIMEI(imei: string): boolean {
  const cleaned = imei.replace(/\D/g, "");
  if (cleaned.length !== 15) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(cleaned[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// ── Guess brand from TAC (first 8 digits) ────

function guessBrand(imei: string): string {
  const tac = imei.slice(0, 8);

  // Common TAC prefixes for major brands
  const brandMap: Record<string, string> = {
    "01": "Samsung",
    "10": "Samsung",
    "35": "Apple",
    "45": "LG",
    "50": "Sony",
    "86": "Huawei",
    "99": "OnePlus",
  };

  // Check if TAC starts with known prefix
  for (const [prefix, brand] of Object.entries(brandMap)) {
    if (tac.startsWith(prefix)) {
      return brand;
    }
  }

  return "Unknown Brand";
}

function formatIMEI(imei: string): string {
  const c = imei.replace(/\D/g, "");
  return c.replace(/(\d{2})(\d{6})(\d{6})(\d{1})/, "$1-$2-$3-$4");
}

// ── Laser scan line animation ─────────────────

function ScanOverlay({ scanning }: { scanning: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Corner brackets */}
      {[
        "top-4 left-4 border-t-2 border-l-2 rounded-tl-lg",
        "top-4 right-4 border-t-2 border-r-2 rounded-tr-lg",
        "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg",
        "bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 border-yellow-400 ${cls} ${scanning ? "opacity-100" : "opacity-30"} transition-opacity duration-300`}
        />
      ))}

      {/* Laser line */}
      {scanning && (
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-laser-scan opacity-90" />
          <div className="h-4 bg-gradient-to-b from-yellow-400/20 to-transparent -mt-2" />
        </div>
      )}

      {/* Center guide text */}
      {scanning && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <span className="text-yellow-400 text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Point at IMEI barcode
          </span>
        </div>
      )}
    </div>
  );
}

// ── History Row ───────────────────────────────

function HistoryRow({
  item,
  onCopy,
  onDelete,
}: {
  item: ScannedIMEI;
  onCopy: (imei: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 transition-colors group">
      {/* Valid indicator */}
      <div
        className={`flex-shrink-0 ${item.valid ? "text-green-400" : "text-red-400"}`}
      >
        {item.valid ? (
          <CheckCircle2 size={18} strokeWidth={2} />
        ) : (
          <XCircle size={18} strokeWidth={2} />
        )}
      </div>

      {/* IMEI info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-mono font-semibold text-sm tracking-wider truncate">
          {formatIMEI(item.imei)}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-500 text-[10px]">{item.scannedAt}</span>
          <Badge
            variant={item.method === "camera" ? "blue" : "purple"}
            size="sm"
          >
            {item.method === "camera" ? "📷 Scanned" : "⌨️ Manual"}
          </Badge>
          {!item.valid && (
            <Badge variant="red" size="sm">
              Invalid
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onCopy(item.imei)}
          title="Copy IMEI"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all cursor-pointer"
        >
          <ClipboardCopy size={13} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          title="Delete"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────

const IMEIScanner = () => {
  // Inventory hooks
  const { addDevice } = useInventory();

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCamId, setActiveCamId] = useState<string>("");
  const [scanResult, setScanResult] = useState<string>("");
  const [scanError, setScanError] = useState<string>("");
  const [manualIMEI, setManualIMEI] = useState("");
  const [history, setHistory] = useState<ScannedIMEI[]>([]);
  const [detailItem, setDetailItem] = useState<ScannedIMEI | null>(null);
  const [camDropOpen, setCamDropOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Device details modal state
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const { toasts, addToast } = useToast();

  // ── List cameras on mount ─────────────────

  useEffect(() => {
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((devices) => {
        setCameras(devices);

        if (devices.length === 0) {
          setScanError("No camera found on this device");
          return;
        }

        // Prefer rear camera
        const rear = devices.find(
          (d, index) => index === 0 || /back|rear|environment/i.test(d.label),
        );

        const selectedDevice =
          rear?.deviceId || devices.find((d) => d.deviceId)?.deviceId;

        if (selectedDevice) {
          setActiveCamId(selectedDevice);
        } else {
          setScanError("Unable to detect camera device");
        }
      })
      .catch(() =>
        setScanError("Camera permission denied. Please allow camera access."),
      );
  }, []);

  // ── Stop scanner ──────────────────────────

  const stopScan = useCallback(() => {
    if (readerRef.current) {
      BrowserMultiFormatReader.releaseAllStreams();
      readerRef.current = null;
    }
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopScan(), [stopScan]);

  // ── Handle a successful scan ──────────────

  const handleScanSuccess = (raw: string, method: "camera" | "manual") => {
    // IMEI barcodes often include extra chars — extract 15-digit sequence
    const match = raw.match(/\d{15}/);
    const imei = match ? match[0] : raw.replace(/\D/g, "");
    const valid = validateIMEI(imei);

    const entry: ScannedIMEI = {
      id: Math.random().toString(36).slice(2),
      imei,
      scannedAt: new Date().toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      method,
      valid,
      brand: guessBrand(imei),
    };

    setScanResult(imei);
    setDetailItem(entry);
    
    // Add to scan history automatically
    setHistory((prev) => [entry, ...prev]);

    addToast({
      message: valid
        ? `✅ Valid IMEI: ${formatIMEI(imei)}`
        : `⚠️ Scanned: ${imei} (invalid checksum)`,
      type: valid ? "success" : "warning",
    });
    
    // Open device details modal to save to inventory
    setShowDeviceModal(true);
  };

  // ── Handle Save Device to Inventory ─────

  const handleSaveDevice = (deviceData: ICreateDeviceRequest) => {
    addDevice(deviceData);
    addToast({
      message: `✅ Device added to inventory: ${deviceData.brand} ${deviceData.model}`,
      type: "success",
    });
    setShowDeviceModal(false);
    setDetailItem(null);
    setScanResult("");
    setManualIMEI("");
  };

  // ── Start scanner ─────────────────────────

  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

    setScanError("");
    setScanResult("");

    try {
      // Ask permission FIRST
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          focusMode: "continuous",
        } as any,
      });

      // Reload cameras after permission
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      if (!devices.length) {
        setScanError("No camera found");
        return;
      }

      const rear =
        devices.find((d) => /back|rear|environment/i.test(d.label)) ||
        devices[0];

      setActiveCamId(rear.deviceId);

      const hints = new Map();

      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);

      const reader = new BrowserMultiFormatReader(hints);
      readerRef.current = reader;

      setScanning(true);

      await reader.decodeFromVideoDevice(
        rear.deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleScanSuccess(result.getText(), "camera");
            stopScan();
          }

          if (err && err.name !== "NotFoundException") {
            console.warn(err);
          }
        },
      );
    } catch (e: any) {
      setScanError(e?.message || "Camera failed");
      setScanning(false);
    }
  }, [stopScan]);

  // ── Manual entry ──────────────────────────

  const handleManual = () => {
    const cleaned = manualIMEI.replace(/\D/g, "");
    if (cleaned.length < 15) {
      addToast({ message: "IMEI must be 15 digits", type: "error" });
      return;
    }
    handleScanSuccess(cleaned, "manual");
    setManualIMEI("");
  };

  // ── Copy to clipboard ─────────────────────

  const copyToClipboard = (imei: string) => {
    navigator.clipboard.writeText(imei).then(() => {
      setCopied(true);
      addToast({ message: "IMEI copied to clipboard!", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Switch camera ─────────────────────────

  const switchCamera = (deviceId: string) => {
    setActiveCamId(deviceId);
    setCamDropOpen(false);
    if (scanning) {
      stopScan();
      setTimeout(startScan, 300);
    }
  };

  const activeCamera = cameras.find((c) => c.deviceId === activeCamId);

  return (
    <PageBackground>
      <Layout title="IMEI Scanner - Basit Mobile Zone">
        <div className="flex h-screen overflow-hidden">
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Body */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* ── Info Banner ── */}
                <AnimateIn>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <Info
                      size={16}
                      className="text-blue-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-blue-300 text-sm leading-relaxed">
                      <span className="font-semibold">Tip:</span> On mobile, tap{" "}
                      <span className="text-yellow-400 font-semibold">
                        Start Camera
                      </span>{" "}
                      and point at the IMEI barcode printed on the phone box or
                      under the battery. You can also dial{" "}
                      <span className="font-mono text-white">*#06#</span> to get
                      the IMEI on screen, then type it manually.
                    </p>
                  </div>
                </AnimateIn>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* ── Left: Camera + Manual ── */}
                  <div className="space-y-5">
                    {/* Camera Viewer */}
                    <AnimateIn>
                      <Card padding="md">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <h2 className="text-white font-black text-base flex items-center gap-2">
                              <Camera size={16} className="text-yellow-400" />
                              Camera Scanner
                            </h2>
                            {/* Camera selector */}
                            {cameras.length > 1 && (
                              <div className="relative">
                                <button
                                  onClick={() => setCamDropOpen((o) => !o)}
                                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
                                >
                                  <FlipHorizontal size={12} />
                                  <span className="hidden sm:inline truncate max-w-[80px]">
                                    {activeCamera?.label
                                      ?.replace(/\(.*\)/, "")
                                      .trim() || "Camera"}
                                  </span>
                                  <ChevronDown
                                    size={11}
                                    className={`transition-transform ${camDropOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                                {camDropOpen && (
                                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a0a2e] border border-white/15 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                    {cameras.map((cam) => (
                                      <button
                                        key={cam.deviceId}
                                        onClick={() =>
                                          switchCamera(cam.deviceId)
                                        }
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                                          cam.deviceId === activeCamId
                                            ? "bg-purple-600/20 text-yellow-400 font-semibold"
                                            : "text-gray-300 hover:bg-white/8"
                                        }`}
                                      >
                                        {cam.label ||
                                          `Camera ${cameras.indexOf(cam) + 1}`}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card.Header>

                        {/* Video feed */}
                        <div className="relative w-full aspect-[4/3] bg-black/60 rounded-2xl overflow-hidden border border-white/10">
                          <video
                            ref={videoRef}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${scanning ? "opacity-100" : "opacity-0"}`}
                            muted
                            playsInline
                            style={{ transform: "scale(1.05)" }}
                          />

                          {/* Idle placeholder */}
                          {!scanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <CameraOff
                                  size={36}
                                  className="text-gray-600"
                                />
                              </div>
                              <p className="text-gray-500 text-sm">
                                Camera is off
                              </p>
                            </div>
                          )}

                          {/* Scan overlay */}
                          <ScanOverlay scanning={scanning} />
                        </div>

                        {/* Error */}
                        {scanError && (
                          <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <XCircle
                              size={14}
                              className="text-red-400 flex-shrink-0"
                            />
                            <p className="text-red-300 text-xs">{scanError}</p>
                          </div>
                        )}

                        {/* Controls */}
                        <div className="flex gap-3 mt-4">
                          {!scanning ? (
                            <Button
                              variant="primary"
                              size="md"
                              fullWidth
                              iconLeft={<Camera size={15} />}
                              onClick={startScan}
                              // disabled={!activeCamId}
                            >
                              Start Camera
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="danger"
                                size="md"
                                fullWidth
                                iconLeft={<CameraOff size={15} />}
                                onClick={stopScan}
                              >
                                Stop Camera
                              </Button>
                              <Button
                                variant="dark"
                                size="md"
                                iconLeft={<RefreshCw size={15} />}
                                onClick={() => {
                                  stopScan();
                                  setTimeout(startScan, 400);
                                }}
                              >
                                Restart
                              </Button>
                            </>
                          )}
                        </div>
                      </Card>
                    </AnimateIn>

                    {/* Manual Entry */}
                    <AnimateIn delay={100}>
                      <Card padding="md">
                        <Card.Header>
                          <h2 className="text-white font-black text-base">
                            ⌨️ Manual Entry
                          </h2>
                        </Card.Header>
                        <p className="text-gray-400 text-sm mb-4">
                          Type or paste the 15-digit IMEI number from the
                          device.
                        </p>
                        <div className="flex gap-3">
                          <Input
                            placeholder="e.g. 357391089012345"
                            value={manualIMEI}
                            onChange={(e) => {
                              // Allow only digits, max 15
                              const v = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 15);
                              setManualIMEI(v);
                            }}
                            suffix={
                              <span
                                className={`text-[10px] font-mono ${manualIMEI.length === 15 ? "text-green-400" : "text-gray-500"}`}
                              >
                                {manualIMEI.length}/15
                              </span>
                            }
                            hint="Dial *#06# on the phone to see the IMEI"
                            className="flex-1"
                          />
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={handleManual}
                            disabled={manualIMEI.length !== 15}
                          >
                            Add
                          </Button>
                        </div>
                      </Card>
                    </AnimateIn>
                  </div>

                  {/* ── Right: Last result + History ── */}
                  <div className="space-y-5">
                    {/* Last scan result */}
                    <AnimateIn delay={80}>
                      <Card padding="md">
                        <Card.Header>
                          <h2 className="text-white font-black text-base">
                            Last Result
                          </h2>
                        </Card.Header>

                        {scanResult ? (
                          <div className="space-y-4">
                            {/* IMEI display */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/15 to-blue-600/10 border border-purple-500/25 text-center">
                              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
                                IMEI Number
                              </p>
                              <p className="text-white font-mono font-black text-2xl sm:text-3xl tracking-widest break-all">
                                {formatIMEI(scanResult)}
                              </p>
                              <div className="flex items-center justify-center gap-2 mt-3">
                                {validateIMEI(scanResult) ? (
                                  <Badge variant="green" dot>
                                    Valid IMEI
                                  </Badge>
                                ) : (
                                  <Badge variant="red">Invalid Checksum</Badge>
                                )}
                              </div>
                            </div>

                            {/* Checksum info */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-xl bg-white/4 border border-white/8 text-center">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                                  TAC Code
                                </p>
                                <p className="text-white font-mono font-bold text-sm mt-1">
                                  {scanResult.slice(0, 8)}
                                </p>
                              </div>
                              <div className="p-3 rounded-xl bg-white/4 border border-white/8 text-center">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                                  Serial
                                </p>
                                <p className="text-white font-mono font-bold text-sm mt-1">
                                  {scanResult.slice(8, 14)}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant={copied ? "success" : "primary"}
                              size="md"
                              fullWidth
                              iconLeft={
                                copied ? (
                                  <CheckCircle2 size={15} />
                                ) : (
                                  <ClipboardCopy size={15} />
                                )
                              }
                              onClick={() => copyToClipboard(scanResult)}
                            >
                              {copied ? "Copied!" : "Copy IMEI"}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                              <ScanBarcode
                                size={28}
                                className="text-gray-600"
                              />
                            </div>
                            <p className="text-gray-500 text-sm text-center">
                              No IMEI scanned yet.
                              <br />
                              Start the camera or enter manually.
                            </p>
                          </div>
                        )}
                      </Card>
                    </AnimateIn>

                    {/* History */}
                    <AnimateIn delay={160}>
                      <Card padding="md">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <h2 className="text-white font-black text-base">
                              Scan History
                              {history.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                  ({history.length})
                                </span>
                              )}
                            </h2>
                            {history.length > 0 && (
                              <Button
                                variant="ghost"
                                size="xs"
                                iconLeft={<Trash2 size={11} />}
                                onClick={() => {
                                  setHistory([]);
                                  setScanResult("");
                                }}
                              >
                                Clear All
                              </Button>
                            )}
                          </div>
                        </Card.Header>

                        {history.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <p className="text-gray-600 text-sm">
                              No scans yet
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {history.map((item) => (
                              <HistoryRow
                                key={item.id}
                                item={item}
                                onCopy={copyToClipboard}
                                onDelete={(id) =>
                                  setHistory((prev) =>
                                    prev.filter((h) => h.id !== id),
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}
                      </Card>
                    </AnimateIn>
                  </div>
                </div>

                {/* ── Stats strip ── */}
                {history.length > 0 && (
                  <AnimateIn delay={200}>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          label: "Total Scanned",
                          value: history.length,
                          accent:
                            "bg-purple-500/15 border-purple-500/20 text-purple-300",
                        },
                        {
                          label: "Valid",
                          value: history.filter((h) => h.valid).length,
                          accent:
                            "bg-green-500/15  border-green-500/20  text-green-300",
                        },
                        {
                          label: "Invalid",
                          value: history.filter((h) => !h.valid).length,
                          accent:
                            "bg-red-500/15    border-red-500/20    text-red-300",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className={`rounded-2xl border p-4 text-center ${s.accent}`}
                        >
                          <p className="text-2xl font-black">{s.value}</p>
                          <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </AnimateIn>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* ── Device Details Modal ── */}
        <DeviceDetailsModal
          open={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSave={handleSaveDevice}
          initialIMEI={detailItem?.imei}
          initialTAC={detailItem?.imei.slice(0, 8)}
          initialBrand={detailItem?.brand}
        />

        <ToastContainer toasts={toasts} />

        {/* Laser animation */}
        <style>{`
        @keyframes laser-scan {
          0%   { transform: translateY(-60px); opacity: 0;   }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(60px);  opacity: 0;   }
        }
        .animate-laser-scan {
          animation: laser-scan 1.8s ease-in-out infinite;
        }
      `}</style>
      </Layout>
    </PageBackground>
  );
};

export default IMEIScanner;
