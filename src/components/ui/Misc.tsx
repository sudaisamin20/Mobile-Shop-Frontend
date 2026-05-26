// components/ui/Misc.tsx
// ─────────────────────────────────────────────
// Exports:  Toast · Avatar · Divider · Tabs · Spinner · PageBackground
// ─────────────────────────────────────────────

"use client";
import { type ReactNode, useState } from "react";

// ── Toast ────────────────────────────────────
// Usage:
//   const { toasts, addToast } = useToast();
//   addToast({ message: "Phone added!", type: "success" });
//   <ToastContainer toasts={toasts} />

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const toastStyles: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "border-green-500/40 bg-green-500/10",  icon: "✅" },
  error:   { bg: "border-red-500/40   bg-red-500/10",    icon: "❌" },
  warning: { bg: "border-yellow-500/40 bg-yellow-500/10", icon: "⚠️" },
  info:    { bg: "border-blue-500/40  bg-blue-500/10",   icon: "ℹ️" },
};

export function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl",
            "text-sm text-white font-medium shadow-lg",
            "animate-toast-in pointer-events-auto",
            toastStyles[t.type].bg,
          ].join(" ")}
        >
          <span>{toastStyles[t.type].icon}</span>
          <span>{t.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes toast-in { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        .animate-toast-in { animation: toast-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards }
      `}</style>
    </div>
  );
}

export function useToast(duration = 3000) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function addToast(item: Omit<ToastItem, "id">) {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...item, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }

  return { toasts, addToast };
}

// ── Avatar ───────────────────────────────────
// Usage:
//   <Avatar name="Basit Khan" size="md" />
//   <Avatar src="/profile.jpg" size="lg" status="online" />

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "busy";
  className?: string;
}

const sizeClasses: Record<AvatarSize, { wrapper: string; text: string; status: string }> = {
  xs: { wrapper: "w-6  h-6",  text: "text-[10px]", status: "w-1.5 h-1.5 -right-0 -bottom-0" },
  sm: { wrapper: "w-8  h-8",  text: "text-xs",     status: "w-2   h-2   -right-0 -bottom-0" },
  md: { wrapper: "w-10 h-10", text: "text-sm",     status: "w-2.5 h-2.5 right-0  bottom-0"  },
  lg: { wrapper: "w-14 h-14", text: "text-lg",     status: "w-3   h-3   right-0  bottom-0"  },
  xl: { wrapper: "w-20 h-20", text: "text-2xl",    status: "w-4   h-4   right-0.5 bottom-0.5" },
};

const statusColors = { online: "bg-green-400", offline: "bg-gray-500", busy: "bg-yellow-400" };

function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
}

export function Avatar({ name, src, size = "md", status, className = "" }: AvatarProps) {
  const s = sizeClasses[size];
  return (
    <div className={["relative inline-flex flex-shrink-0", className].join(" ")}>
      <div
        className={[
          s.wrapper,
          "rounded-full flex items-center justify-center overflow-hidden",
          "bg-gradient-to-br from-purple-600 to-blue-600",
          "border-2 border-white/10",
        ].join(" ")}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className={[s.text, "font-bold text-white select-none"].join(" ")}>
            {initials(name)}
          </span>
        )}
      </div>
      {status && (
        <span
          className={[
            "absolute rounded-full border-2 border-[#0b0614]",
            s.status,
            statusColors[status],
          ].join(" ")}
        />
      )}
    </div>
  );
}

// ── Divider ──────────────────────────────────
// Usage: <Divider label="or continue with" />

export function Divider({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={["flex items-center gap-4 my-6", className].join(" ")}>
      <div className="flex-1 h-px bg-white/10" />
      {label && <span className="text-gray-500 text-xs font-medium whitespace-nowrap">{label}</span>}
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// ── Tabs ─────────────────────────────────────
// Usage:
//   <Tabs
//     tabs={[{ key: "all", label: "All" }, { key: "apple", label: "Apple" }]}
//     active="all"
//     onChange={(key) => setFilter(key)}
//   />

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div
      className={[
        "inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 flex-wrap",
        className,
      ].join(" ")}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={[
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2",
            active === tab.key
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={[
                "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                active === tab.key ? "bg-white/20 text-white" : "bg-white/10 text-gray-400",
              ].join(" ")}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Spinner ──────────────────────────────────
// Usage: <Spinner size="md" />

export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];
  return (
    <svg className={[s, "animate-spin text-purple-400", className].join(" ")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

// ── PageBackground ───────────────────────────
// Ambient blob background — wrap your layout with this

export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0614] text-white font-sans overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-3xl animate-blob1" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-yellow-500/8 blur-3xl animate-blob2" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-blue-600/12 blur-3xl animate-blob3" />
      </div>
      <div className="relative z-10">{children}</div>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.05)} 66%{transform:translate(20px,-20px) scale(0.9)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,30px) scale(1.08)} 66%{transform:translate(-40px,-10px) scale(0.95)} }
        .animate-blob1 { animation: blob1 12s ease-in-out infinite }
        .animate-blob2 { animation: blob2 15s ease-in-out infinite }
        .animate-blob3 { animation: blob3 10s ease-in-out infinite }
      `}</style>
    </div>
  );
}