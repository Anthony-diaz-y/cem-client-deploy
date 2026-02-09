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
      <label className="block text-[10px] font-black text-cem-neutral-gray-900 uppercase tracking-widest mb-2.5 ml-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-cem-neutral-gray-50/50 border border-cem-neutral-gray-100 rounded-2xl text-cem-neutral-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary flex items-center justify-between hover:bg-white hover:border-cem-primary/30 transition-all shadow-sm"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-cem-neutral-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-cem-primary" : ""
            }`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-hidden animate-scaleIn origin-top">
          <div className="flex flex-col py-2 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-6 py-3 text-left text-sm transition-all ${value === option.value
                    ? "bg-cem-primary/10 text-cem-primary font-black"
                    : "text-cem-neutral-gray-600 font-bold hover:bg-cem-neutral-gray-50 hover:text-cem-neutral-gray-900"
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

