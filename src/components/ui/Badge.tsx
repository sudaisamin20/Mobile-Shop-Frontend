import type { ReactNode } from "react";

type BadgeVariant =
  | "yellow"
  | "purple"
  | "blue"
  | "green"
  | "red"
  | "gray"
  | "orange";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean; // animated pulsing dot before text
  children: ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  yellow: "bg-yellow-400/15 text-yellow-400 border-yellow-400/25",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  blue: "bg-blue-500/15   text-blue-400   border-blue-500/25",
  green: "bg-green-500/15  text-green-400  border-green-500/25",
  red: "bg-red-500/15    text-red-400    border-red-500/25",
  gray: "bg-white/8       text-gray-400   border-white/10",
  orange: "bg-orange-500/15 text-orange-400 border-orange-400/25",
};

const dotColorMap: Record<BadgeVariant, string> = {
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  gray: "bg-gray-400",
  orange: "bg-orange-400",
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2   py-0.5 gap-1",
  md: "text-xs     px-3   py-1   gap-1.5",
  lg: "text-sm     px-3.5 py-1.5 gap-2",
};

export function Badge({
  variant = "yellow",
  size = "md",
  dot = false,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-semibold rounded-full border",
        variantMap[variant],
        sizeMap[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorMap[variant]}`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColorMap[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
