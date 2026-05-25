import React, { useState, useEffect, useRef } from "react";
import DropdownButton from "./DropdownButton";
import DropdownContent from "./DropdownContent";

interface DropdownProps {
  buttonText: React.ReactNode;
  content: React.ReactNode;
  align?: "left" | "right"; // dropdown alignment
}

const Dropdown: React.FC<DropdownProps> = ({ buttonText, content, align = "right" }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDropdown = () => setOpen((prev) => !prev);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50 inline-block">
      <DropdownButton toggle={toggleDropdown} open={open}>
        {buttonText}
      </DropdownButton>
      {open && <DropdownContent open={open} align={align}>{content}</DropdownContent>}
    </div>
  );
};

export default Dropdown;
