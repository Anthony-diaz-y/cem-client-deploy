"use client";

import React, { useState, useRef, useEffect } from "react";

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

/**
 * Componente dropdown personalizado con funcionalidad de selección
 * y cierre automático al hacer click fuera del componente
 */
export default function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar...",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown cuando se hace click fuera del componente
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

  // Maneja la selección de una opción y cierra el dropdown
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[13px] font-bold text-cem-neutral-gray-700 mb-2 ml-1 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-4 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-lg text-left font-medium transition-all flex items-center justify-between text-cem-neutral-gray-900 hover:bg-white hover:border-cem-primary transition-all shadow-sm`}
      >
        <span className="truncate text-sm text-cem-neutral-gray-600 font-semibold">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-cem-neutral-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden animate-scaleIn origin-top">
          <div className="flex flex-col py-3 gap-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`mx-2 my-0.5 px-6 py-4 rounded-xl cursor-pointer transition-all font-medium text-left ${value === option.value
                  ? "bg-[#DCEEEF] text-cem-primary"
                  : "text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {value === option.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cem-primary"></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

