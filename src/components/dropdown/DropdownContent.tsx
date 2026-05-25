import React from "react";

interface DropdownContentProps {
  children: React.ReactNode;
  open: boolean;
  align?: "left" | "right";
}

const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  open,
  align = "right",
}) => {
  return (
    <div
      className={[
        "absolute top-full mt-2.5 min-w-48",
        align === "right" ? "right-0" : "left-0",
        "bg-gradient-to-br from-[#1a0a2e] to-[#0f0520]",
        "border border-white/15 rounded-2xl",
        "backdrop-blur-xl shadow-2xl shadow-black/50",
        "overflow-hidden",
        "transition-all duration-200 ease-in-out origin-top-right",
        open
          ? "opacity-100 scale-y-100 pointer-events-auto"
          : "opacity-0 scale-y-95 pointer-events-none",
      ].join(" ")}
      role="menu"
    >
      <div className="py-1.5 px-1.5 space-y-0.5">
        {children}
      </div>
    </div>
  );
};

export default DropdownContent;
