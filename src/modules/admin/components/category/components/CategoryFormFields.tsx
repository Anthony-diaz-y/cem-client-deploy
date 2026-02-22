"use client";

import React from "react";
import { SvgIconUploader } from "./SvgIconUploader";

interface CategoryFormFieldsProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  icon: string;
  setIcon: (icon: string) => void;
  type: string;
  setType: (type: "career" | "sector") => void;
  loading: boolean;
}

/**
 * Campos de formulario compartidos para crear y editar categorías
 */
export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  name,
  setName,
  description,
  setDescription,
  icon,
  setIcon,
  type,
  setType,
  loading,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const typeOptions = [
    { id: "career", name: "Carrera" },
    { id: "sector", name: "Sector" },
  ];

  // Cierre al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 py-2 space-y-4 flex flex-col items-center justify-center">
      {/* Tipo de categoría (Dominio) */}
      <div className="w-[744px] flex flex-col space-y-1 flex-shrink-0 relative">
        <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
          Tipo de categoría<span className="text-red-500">*</span>
        </label>

        {/* Custom Premium Dropdown */}
        <div className="relative group" ref={dropdownRef}>
          <div
            onClick={() => !loading && setIsOpen(!isOpen)}
            className={`w-full h-[58px] px-6 bg-[#F8FDFE] border-b-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all focus-within:ring-4 focus-within:ring-cem-primary/5
                            ${isOpen ? "border-cem-primary ring-4 ring-cem-primary/5" : "border-cem-neutral-gray-300"}
                            ${loading ? "opacity-50 cursor-wait" : ""}
                        `}
          >
            <span
              className={`font-medium ${type ? "text-cem-neutral-gray-900" : "text-cem-neutral-gray-400"}`}
            >
              {type
                ? type === "career"
                  ? "Carrera"
                  : "Sector"
                : "Elige si es carrera o sector"}
            </span>
            <div
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            >
              <svg
                className="w-6 h-6 text-cem-neutral-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-[68px] left-0 w-full bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-fadeInUp">
              {typeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setType(opt.id as "career" | "sector");
                    setIsOpen(false);
                  }}
                  className={`mx-2 px-6 py-4 rounded-xl cursor-pointer transition-all font-medium ${
                    type === opt.id
                      ? "bg-[#DCEEEF] text-cem-primary font-bold"
                      : "text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                  }`}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Nombre de la Categoría */}
      <div className="w-[744px] flex flex-col space-y-1 flex-shrink-0">
        <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
          Nombre de la Categoría<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Programación, Diseño"
          className="w-full h-[58px] px-6 bg-[#F8FDFE] border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
          required
          disabled={loading}
        />
      </div>

      {/* Descripción */}
      <div className="w-[744px] flex flex-col space-y-1 flex-shrink-0">
        <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente qué tipo de cursos pertenecen a esta categoría"
          className="w-full min-h-[58px] px-6 py-4 bg-[#F8FDFE] border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all resize-none shadow-sm"
          required
          disabled={loading}
        />
      </div>

      {/* Ícono SVG */}
      <SvgIconUploader value={icon} onChange={setIcon} disabled={loading} />
    </div>
  );
};
