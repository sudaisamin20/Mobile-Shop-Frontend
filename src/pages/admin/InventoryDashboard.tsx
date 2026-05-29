import { useState } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Smartphone,
  ScanBarcode,
} from "lucide-react";
import { Layout } from "../../layout";
import { Button, Card, StatsCard, PageBackground } from "../../components/ui";
import { DeviceDetailsModal, InventoryTable, AddStockModal } from "../../components/inventory";
import { useInventory } from "../../hooks/useInventory";
import type { IDevice, ICreateDeviceRequest } from "../../interfaces/inventory";
import type { ScannedIMEI } from "../../components/inventory/AddStockModal";

export function InventoryDashboard() {
  const {
    paginatedDevices,
    filters,
    pagination,
    stats,
    summary,
    addDevice,
    deleteDevice,
    setFilters,
    setPagination,
  } = useInventory();

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [templateDevice, setTemplateDevice] = useState<IDevice | null>(null);
  const [viewingDevice, setViewingDevice] = useState<IDevice | null>(null);

  // ── Handle Add Device Template ────────
  const handleAddDevice = (deviceData: ICreateDeviceRequest) => {
    const newDevice = addDevice(deviceData);
    // Set as template and open stock modal
    setTemplateDevice(newDevice);
    setShowDeviceModal(false);
    setShowAddStockModal(true);
  };

  // ── Handle Add Stock Units (from IMEI scans)
  const handleAddStock = (scannedIMEIs: ScannedIMEI[]) => {
    if (!templateDevice) return;

    // Create a device for each scanned IMEI
    scannedIMEIs.forEach((scan) => {
      const deviceData: ICreateDeviceRequest = {
        brand: templateDevice.brand,
        model: templateDevice.model,
        variant: templateDevice.variant,
        color: templateDevice.color,
        countryVersion: templateDevice.countryVersion,
        imei1: scan.imei,
        imei2: templateDevice.imei2,
        serialNumber: templateDevice.serialNumber,
        condition: templateDevice.condition,
        batteryHealth: templateDevice.batteryHealth,
        screenCondition: templateDevice.screenCondition,
        cameraCondition: templateDevice.cameraCondition,
        speakerCondition: templateDevice.speakerCondition,
        chargingCondition: templateDevice.chargingCondition,
        ptaStatus: templateDevice.ptaStatus,
        purchasePrice: templateDevice.purchasePrice,
        sellingPrice: templateDevice.sellingPrice,
        quantity: 1,
        stockStatus: templateDevice.stockStatus,
        shelfLocation: templateDevice.shelfLocation,
        notes: templateDevice.notes,
        accessories: templateDevice.accessories,
        images: templateDevice.images,
      };
      addDevice(deviceData);
    });

    // Reset and close modal
    setShowAddStockModal(false);
    setTemplateDevice(null);
  };

  // ── Handle Delete Device ───────────────
  const handleDeleteDevice = (device: IDevice) => {
    if (confirm(`Delete ${device.brand} ${device.model}?`)) {
      deleteDevice(device.id);
    }
  };

  // ── Handle Edit Device ─────────────────
  const handleEditDevice = (device: IDevice) => {
    // For now, we can't edit existing devices with the current modal
    // The modal is designed for creating templates and adding stock units
    console.log("Edit device:", device);
  };

  // ── Profit Trend ───────────────────────
  const yesterdayProfit = stats.totalProfit * 0.85; // Mock data
  const profitTrend = stats.totalProfit > yesterdayProfit ? true : false;
  const profitChange = Math.abs(
    (((stats.totalProfit - yesterdayProfit) / yesterdayProfit) * 100).toFixed(
      1,
    ),
  );

  return (
    <PageBackground>
      <Layout title="Inventory Dashboard - Basit Mobile Zone">
        <div className="flex h-screen overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Body */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-white mb-1">
                      Inventory Dashboard
                    </h1>
                    <p className="text-gray-400">
                      {stats.totalDevices} devices in stock
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {templateDevice && (
                      <Button
                        variant="secondary"
                        size="md"
                        iconLeft={<ScanBarcode size={16} />}
                        onClick={() => setShowAddStockModal(true)}
                      >
                        Add Stock Units
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      iconLeft={<Plus size={16} />}
                      onClick={() => {
                        setShowDeviceModal(true);
                      }}
                    >
                      Add Device Template
                    </Button>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    label="Total Devices"
                    value={stats.totalDevices}
                    icon={<Package size={24} />}
                    variant="primary"
                  />
                  <StatsCard
                    label="Available Now"
                    value={stats.availableDevices}
                    icon={<Smartphone size={24} />}
                    variant="success"
                    trend={{
                      value: 12,
                      isPositive: true,
                      label: "vs last week",
                    }}
                  />
                  <StatsCard
                    label="Total Profit"
                    value={`₨${(stats.totalProfit / 1000).toFixed(1)}K`}
                    icon={<DollarSign size={24} />}
                    variant="success"
                    trend={{
                      value: parseFloat(profitChange as any),
                      isPositive: profitTrend,
                      label: "vs yesterday",
                    }}
                  />
                  <StatsCard
                    label="Low Stock Alerts"
                    value={stats.lowStockAlerts}
                    icon={<AlertTriangle size={24} />}
                    variant={stats.lowStockAlerts > 0 ? "warning" : "info"}
                  />
                </div>

                {/* Profit Summary */}
                <Card padding="lg">
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-yellow-400" />
                      <h2 className="text-white font-black text-lg">
                        Financial Summary
                      </h2>
                    </div>
                  </Card.Header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Total Purchase Value
                      </p>
                      <p className="text-white font-black text-2xl">
                        ₨{(stats.totalPurchaseValue / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Stock Selling Value
                      </p>
                      <p className="text-white font-black text-2xl">
                        ₨{(stats.totalSellingValue / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Profit</p>
                      <p className="text-green-400 font-black text-2xl">
                        +₨{(stats.totalProfit / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Average Margin
                      </p>
                      <p className="text-yellow-400 font-black text-2xl">
                        {stats.averageMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Top Brands */}
                {summary.topBrands.length > 0 && (
                  <Card padding="lg">
                    <Card.Header>
                      <h2 className="text-white font-black text-lg">
                        Top Brands by Inventory
                      </h2>
                    </Card.Header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {summary.topBrands.map((brand) => (
                        <div
                          key={brand.brand}
                          className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20"
                        >
                          <h3 className="text-white font-bold mb-2">
                            {brand.brand}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-400 text-xs">
                              <span className="text-white font-semibold">
                                {brand.count}
                              </span>{" "}
                              devices
                            </p>
                            <p className="text-green-400 text-xs font-semibold">
                              ₨{(brand.profit / 1000).toFixed(1)}K profit
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Inventory Table */}
                <Card padding="lg">
                  <Card.Header>
                    <h2 className="text-white font-black text-lg">
                      Device Inventory
                    </h2>
                  </Card.Header>

                  <InventoryTable
                    devices={paginatedDevices}
                    filters={filters}
                    onFilterChange={setFilters}
                    onPageChange={(page) =>
                      setPagination({ ...pagination, page: Number(page) })
                    }
                    onEdit={handleEditDevice}
                    onDelete={handleDeleteDevice}
                    onView={setViewingDevice}
                    currentPage={pagination.page}
                    itemsPerPage={pagination.limit}
                    total={pagination.total}
                  />
                </Card>
              </div>
            </main>
          </div>
        </div>

        {/* Device Details Modal */}
        <DeviceDetailsModal
          open={showDeviceModal}
          onClose={() => {
            setShowDeviceModal(false);
            setSelectedDevice(null);
          }}
          onSave={handleAddDevice}
        />

        {/* Add Stock Modal */}
        <AddStockModal
          open={showAddStockModal}
          onClose={() => setShowAddStockModal(false)}
          onSaveIMEIs={handleAddStock}
          templateDevice={templateDevice}
        />

        {/* Device Viewing Modal */}
        {viewingDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewingDevice(null)}
            />
            <Card className="relative max-w-2xl w-full">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-black text-xl">
                    {viewingDevice.brand} {viewingDevice.model}
                  </h2>
                  <button
                    onClick={() => setViewingDevice(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </Card.Header>

              <div className="space-y-4">
                {viewingDevice.images.front && (
                  <img
                    src={viewingDevice.images.front}
                    alt="Device"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">IMEI 1</p>
                    <p className="text-white font-mono font-semibold">
                      {viewingDevice.imei1}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Stock</p>
                    <p className="text-white font-semibold">
                      {viewingDevice.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Purchase Price</p>
                    <p className="text-white font-semibold">
                      ₨{viewingDevice.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Selling Price</p>
                    <p className="text-green-400 font-semibold">
                      ₨{viewingDevice.sellingPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {viewingDevice.notes && (
                  <div className="p-3 rounded-lg bg-white/4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">NOTES</p>
                    <p className="text-white">{viewingDevice.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingDevice(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(viewingDevice);
                    setViewingDevice(null);
                    setShowDeviceModal(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Layout>
    </PageBackground>
  );
}

export default InventoryDashboard;
