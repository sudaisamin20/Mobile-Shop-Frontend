import {
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// ── AnimateIn ────────────────────────────────
// Fades + slides up when element enters the viewport

interface AnimateInProps {
  children: ReactNode;
  delay?: number; // ms delay
  className?: string;
  as?: ElementType;
}

export function AnimateIn({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={[
        "transition-all duration-700",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// ── SectionHeader ────────────────────────────

interface SectionHeaderProps {
  eyebrow?: string; // small yellow label above
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <AnimateIn
      className={[centered ? "text-center" : "", "mb-14", className].join(" ")}
    >
      {eyebrow && (
        <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        className={[
          "text-4xl sm:text-5xl font-black text-white leading-tight",
          eyebrow ? "mt-2" : "",
        ].join(" ")}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </AnimateIn>
  );
}

// ── Section ──────────────────────────────────

interface SectionProps {
  id?: string;
  children: ReactNode;
  tinted?: boolean; // adds subtle purple/blue bg wash
  className?: string;
  py?: "sm" | "md" | "lg";
}

const pyMap = { sm: "py-12", md: "py-20", lg: "py-28" };

export function Section({
  id,
  children,
  tinted = false,
  className = "",
  py = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      className={[
        "relative px-4 sm:px-6",
        pyMap[py],
        tinted
          ? "bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-transparent border-y border-white/5"
          : "",
        className,
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

export default Section;
