import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantConfig: Record<
  "primary" | "success" | "warning" | "danger" | "info",
  {
    bg: string;
    border: string;
    icon: string;
    text: string;
  }
> = {
  primary: {
    bg: "from-purple-600/10 to-blue-600/10",
    border: "border-purple-500/20",
    icon: "text-purple-400",
    text: "text-purple-300",
  },
  success: {
    bg: "from-green-600/10 to-emerald-600/10",
    border: "border-green-500/20",
    icon: "text-green-400",
    text: "text-green-300",
  },
  warning: {
    bg: "from-yellow-600/10 to-orange-600/10",
    border: "border-yellow-500/20",
    icon: "text-yellow-400",
    text: "text-yellow-300",
  },
  danger: {
    bg: "from-red-600/10 to-rose-600/10",
    border: "border-red-500/20",
    icon: "text-red-400",
    text: "text-red-300",
  },
  info: {
    bg: "from-blue-600/10 to-cyan-600/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    text: "text-blue-300",
  },
};

export function StatsCard({
  label,
  value,
  icon,
  trend,
  variant = "primary",
  className = "",
}: StatsCardProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl border ${config.border}
        bg-gradient-to-br ${config.bg}
        p-6 transition-all duration-300
        hover:shadow-lg hover:shadow-black/30
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white/5 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with icon and label */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
          {icon && <div className={`${config.icon} flex-shrink-0`}>{icon}</div>}
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-white font-black text-3xl sm:text-4xl mb-1 tracking-tight">
            {typeof value === "number"
              ? value > 1000
                ? (value / 1000).toFixed(1) + "K"
                : value.toLocaleString()
              : value}
          </p>
        </div>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1.5">
            <div
              className={`
                flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg
                ${
                  trend.isPositive
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }
              `}
            >
              {trend.isPositive ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              <span>
                {trend.value}%
              </span>
            </div>
            <span className="text-gray-500 text-xs">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
