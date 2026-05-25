import React from "react";

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean; // For destructive actions
}

const DropdownItem: React.FC<DropdownItemProps> = ({ 
  children, 
  onClick,
  isDanger = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full px-4 py-2.5 rounded-xl cursor-pointer",
        "flex items-center gap-2",
        "text-sm font-medium",
        "transition-all duration-150 ease-in-out",
        "text-left",
        isDanger
          ? [
              "text-red-300 hover:text-red-200",
              "hover:bg-red-500/15 active:bg-red-500/25",
            ].join(" ")
          : [
              "text-gray-200 hover:text-white",
              "hover:bg-white/10 active:bg-white/20",
            ].join(" "),
      ].join(" ")}
      type="button"
      role="menuitem"
    >
      {children}
    </button>
  );
};

export default DropdownItem;
