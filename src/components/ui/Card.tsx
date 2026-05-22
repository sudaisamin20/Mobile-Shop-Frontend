import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "glow" | "solid" | "gradient";
type GlowColor   = "yellow" | "purple" | "blue";
type Padding     = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  glowColor?: GlowColor;
  hoverable?: boolean;
  padding?: Padding;
  children: ReactNode;
}

const glowMap: Record<GlowColor, string> = {
  yellow: "hover:border-yellow-400/40 hover:shadow-[0_0_40px_rgba(250,204,21,0.12)]",
  purple: "hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(147,51,234,0.15)]",
  blue:   "hover:border-blue-500/40   hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]",
};

const paddingMap: Record<Padding, string> = {
  none: "p-0",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
  xl:   "p-10",
};

function CardRoot({
  variant = "default",
  glowColor = "purple",
  hoverable = false,
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  const base =
    "relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm";

  const hoverClass = hoverable
    ? `transition-all duration-500 cursor-pointer hover:-translate-y-2 ${glowMap[glowColor]}`
    : "";

  return (
    <div
      className={[base, paddingMap[padding], hoverClass, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["mb-4", className].join(" ")}>
      {children}
    </div>
  );
}

function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["flex-1", className].join(" ")}>
      {children}
    </div>
  );
}

function CardDivider() {
  return <div className="border-t border-white/8 my-4" />;
}

function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["mt-4 pt-4 border-t border-white/8", className].join(" ")}>
      {children}
    </div>
  );
}

// Attach sub-components
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Divider: CardDivider,
});

export default Card;