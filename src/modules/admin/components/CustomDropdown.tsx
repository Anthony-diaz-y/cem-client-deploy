"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface CustomDropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: CustomDropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar...",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-richblack-300 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-between hover:border-richblack-600 transition-colors"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-richblack-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-richblack-900 border border-richblack-700 rounded-lg shadow-xl max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-richblack-800 transition-colors ${
                value === option.value
                  ? "bg-yellow-500/20 text-yellow-50 font-medium"
                  : "text-richblack-5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

