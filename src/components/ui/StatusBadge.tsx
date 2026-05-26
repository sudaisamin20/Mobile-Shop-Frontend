import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  ShoppingCart,
  Zap,
} from "lucide-react";

type StatusType =
  | "available"
  | "low"
  | "out-of-stock"
  | "reserved"
  | "approved"
  | "pending"
  | "blocked"
  | "unlocked"
  | "locked"
  | "new"
  | "used"
  | "open-box"
  | "refurbished"
  | "perfect"
  | "minor-scratches"
  | "major-damage"
  | "broken"
  | "working"
  | "partial"
  | "not-working"
  | "not-available"
  | "unknown";

interface StatusBadgeProps {
  status: StatusType;
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    bg: string;
    text: string;
    icon?: React.ReactNode;
    label: string;
  }
> = {
  // Stock status
  available: {
    bg: "bg-green-500/15 border border-green-500/30",
    text: "text-green-300",
    icon: <CheckCircle2 size={14} />,
    label: "Available",
  },
  low: {
    bg: "bg-yellow-500/15 border border-yellow-500/30",
    text: "text-yellow-300",
    icon: <AlertCircle size={14} />,
    label: "Low Stock",
  },
  "out-of-stock": {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-300",
    icon: <Package size={14} />,
    label: "Out of Stock",
  },
  reserved: {
    bg: "bg-blue-500/15 border border-blue-500/30",
    text: "text-blue-300",
    icon: <ShoppingCart size={14} />,
    label: "Reserved",
  },

  // PTA status
  approved: {
    bg: "bg-green-500/15 border border-green-500/30",
    text: "text-green-300",
    icon: <CheckCircle2 size={14} />,
    label: "Approved",
  },
  pending: {
    bg: "bg-yellow-500/15 border border-yellow-500/30",
    text: "text-yellow-300",
    icon: <Clock size={14} />,
    label: "Pending",
  },
  blocked: {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-300",
    icon: <AlertCircle size={14} />,
    label: "Blocked",
  },


  // Network lock
  unlocked: {
    bg: "bg-green-500/15 border border-green-500/30",
    text: "text-green-300",
    icon: <CheckCircle2 size={14} />,
    label: "Unlocked",
  },
  locked: {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-300",
    label: "Locked",
  },

  // Condition
  new: {
    bg: "bg-emerald-500/15 border border-emerald-500/30",
    text: "text-emerald-300",
    icon: <Zap size={14} />,
    label: "New",
  },
  used: {
    bg: "bg-blue-500/15 border border-blue-500/30",
    text: "text-blue-300",
    label: "Used",
  },
  "open-box": {
    bg: "bg-purple-500/15 border border-purple-500/30",
    text: "text-purple-300",
    label: "Open Box",
  },
  refurbished: {
    bg: "bg-orange-500/15 border border-orange-500/30",
    text: "text-orange-300",
    label: "Refurbished",
  },

  // Physical condition
  perfect: {
    bg: "bg-green-500/15 border border-green-500/30",
    text: "text-green-300",
    icon: <CheckCircle2 size={14} />,
    label: "Perfect",
  },
  unknown: {
    bg: "bg-gray-500/15 border border-gray-500/30",
    text: "text-gray-300",
    label: "Unknown",
  },
  "minor-scratches": {
    bg: "bg-yellow-500/15 border border-yellow-500/30",
    text: "text-yellow-300",
    label: "Minor Scratches",
  },
  "major-damage": {
    bg: "bg-orange-500/15 border border-orange-500/30",
    text: "text-orange-300",
    label: "Major Damage",
  },
  broken: {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-300",
    label: "Broken",
  },

  // Functional status
  working: {
    bg: "bg-green-500/15 border border-green-500/30",
    text: "text-green-300",
    icon: <CheckCircle2 size={14} />,
    label: "Working",
  },
  partial: {
    bg: "bg-yellow-500/15 border border-yellow-500/30",
    text: "text-yellow-300",
    label: "Partial",
  },
  "not-working": {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-300",
    label: "Not Working",
  },
  "not-available": {
    bg: "bg-gray-500/15 border border-gray-500/30",
    text: "text-gray-300",
    label: "Not Available",
  },
};

const sizeClasses: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "px-2 py-0.5 text-[10px] gap-1",
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3 py-1.5 text-sm gap-2",
  lg: "px-4 py-2 text-base gap-2",
};

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown;

  return (
    <div
      className={`
        inline-flex items-center rounded-lg font-medium
        transition-all duration-200
        ${config.bg} ${config.text} ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && config.icon && <span className="flex-shrink-0">{config.icon}</span>}
      <span className="whitespace-nowrap">{config.label}</span>
    </div>
  );
}
