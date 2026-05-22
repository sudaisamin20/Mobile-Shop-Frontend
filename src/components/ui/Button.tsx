import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary" // Yellow — main CTA
  | "secondary" // Purple-Blue gradient — secondary CTA
  | "outline" // Bordered purple — tertiary
  | "ghost" // Text only, subtle hover
  | "success" // Green — confirm actions
  | "danger" // Red — destructive actions
  | "dark"; // Glass surface — neutral

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode; // icon shown after text
  iconLeft?: ReactNode; // icon shown before text
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold " +
    "hover:shadow-[0_8px_32px_rgba(250,204,21,0.35)] hover:-translate-y-0.5 active:scale-[0.98]",
  secondary:
    "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold " +
    "hover:shadow-[0_8px_32px_rgba(147,51,234,0.35)] hover:-translate-y-0.5 active:scale-[0.98]",
  outline:
    "border border-purple-500/50 text-purple-300 font-semibold bg-transparent " +
    "hover:bg-purple-500/10 hover:border-purple-400 hover:-translate-y-0.5 active:scale-[0.98]",
  ghost:
    "text-gray-300 font-medium bg-transparent " +
    "hover:text-white hover:bg-white/8 active:scale-[0.98]",
  success:
    "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold " +
    "hover:shadow-[0_8px_24px_rgba(34,197,94,0.30)] hover:-translate-y-0.5 active:scale-[0.98]",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold " +
    "hover:shadow-[0_8px_24px_rgba(239,68,68,0.30)] hover:-translate-y-0.5 active:scale-[0.98]",
  dark:
    "bg-white/8 border border-white/10 text-white font-semibold " +
    "hover:bg-white/12 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  xs: "text-xs  px-3   py-1.5 rounded-lg  gap-1.5",
  sm: "text-sm  px-4   py-2   rounded-xl  gap-2",
  md: "text-sm  px-6   py-3   rounded-2xl gap-2",
  lg: "text-base px-8  py-3.5 rounded-2xl gap-2.5",
  xl: "text-lg  px-10  py-4   rounded-2xl gap-3",
};

const Spinner = () => (
  <svg
    className="w-4 h-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
);

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center",
        "transition-all duration-300",
        "select-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-yellow-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        isDisabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!loading && icon && (
        <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}

export default Button;
