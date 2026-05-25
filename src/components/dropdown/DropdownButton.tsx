import React from "react";

interface DropdownButtonProps {
  children: React.ReactNode;
  open: boolean;
  toggle: () => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  open,
  toggle,
}) => {
  return (
    <button
      onClick={toggle}
      type="button"
      className="flex items-center w-fit"
      aria-expanded={open}
    >
      {children}
    </button>
  );
};

export default DropdownButton;
