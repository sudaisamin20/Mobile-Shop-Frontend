type AccentColor = "yellow" | "purple" | "blue" | "green" | "red";

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  trend?: string; // e.g. "+12%" or "-3%"
  trendDown?: boolean; // if true, trend is red. Auto-detected from "-" prefix if omitted.
  accent?: AccentColor;
  className?: string;
}

const accentMap: Record<AccentColor, { gradient: string; iconBg: string }> = {
  yellow: {
    gradient: "from-yellow-400 to-yellow-300",
    iconBg: "bg-yellow-400/10 border-yellow-400/20",
  },
  purple: {
    gradient: "from-purple-400 to-purple-300",
    iconBg: "bg-purple-500/10 border-purple-500/20",
  },
  blue: {
    gradient: "from-blue-400 to-blue-300",
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
  green: {
    gradient: "from-green-400 to-emerald-300",
    iconBg: "bg-green-500/10 border-green-500/20",
  },
  red: {
    gradient: "from-red-400 to-rose-300",
    iconBg: "bg-red-500/10 border-red-500/20",
  },
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendDown,
  accent = "yellow",
  className = "",
}: StatCardProps) {
  const isDown = trendDown ?? trend?.startsWith("-") ?? false;
  const { gradient, iconBg } = accentMap[accent];

  return (
    <div
      className={[
        "relative p-6 rounded-3xl",
        "bg-linear-to-br from-white/8 to-white/3",
        "border border-white/10",
        "transition-all duration-300",
        "hover:border-white/20 hover:-translate-y-1",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2 font-medium">{label}</p>
          <p
            className={[
              "text-3xl font-black bg-linear-to-r bg-clip-text text-transparent",
              gradient,
            ].join(" ")}
          >
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={[
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  isDown
                    ? "bg-red-500/15 text-red-400"
                    : "bg-green-500/15 text-green-400",
                ].join(" ")}
              >
                {isDown ? "↓" : "↑"} {trend.replace(/^[-+]/, "")}
              </span>
              <span className="text-gray-600 text-xs">vs last month</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className={[
              "w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0",
              iconBg,
            ].join(" ")}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
