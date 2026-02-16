"use client";

import React from "react";

interface CategoryFormFieldsProps {
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (description: string) => void;
    categoryType: string;
    setCategoryType: (type: string) => void;
    isSelectOpen: boolean;
    setIsSelectOpen: (isOpen: boolean) => void;
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
    categoryType,
    setCategoryType,
    isSelectOpen,
    setIsSelectOpen,
    loading,
}) => {
    return (
        <div className="flex-1 py-2 space-y-4 flex flex-col items-center justify-center">
            {/* Tipo de categoría - Custom Select */}
            <div className="w-full max-w-[744px] flex flex-col space-y-1 z-20">
                <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
                    Tipo de categoría
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsSelectOpen(!isSelectOpen);
                        }}
                        className={`w-full h-[56px] px-6 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-left font-medium transition-all flex items-center justify-between ${categoryType ? "text-cem-neutral-gray-900" : "text-cem-neutral-gray-400"
                            }`}
                    >
                        <span>{categoryType === "carrera" ? "Carrera" : categoryType === "sector" ? "Sector" : "Elige si es carrera o sector"}</span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform duration-200 ${isSelectOpen ? "rotate-180" : ""}`}
                        >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Dropdown Options */}
                    {isSelectOpen && (
                        <div className="absolute top-[64px] left-0 w-full bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeInUp">
                            <div
                                onClick={() => {
                                    setCategoryType("carrera");
                                    setIsSelectOpen(false);
                                }}
                                className={`mx-2 px-6 py-3 rounded-xl cursor-pointer transition-all font-medium ${categoryType === "carrera"
                                    ? "bg-[#DCEEEF] text-cem-primary"
                                    : "text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                                    }`}
                            >
                                Carrera
                            </div>
                            <div
                                onClick={() => {
                                    setCategoryType("sector");
                                    setIsSelectOpen(false);
                                }}
                                className={`mx-2 px-6 py-3 rounded-xl cursor-pointer transition-all font-medium ${categoryType === "sector"
                                    ? "bg-[#DCEEEF] text-cem-primary"
                                    : "text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                                    }`}
                            >
                                Sector
                            </div>
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
                    className="w-full h-[56px] px-6 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all"
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
                    className="w-full h-[56px] px-6 py-4 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all resize-none overflow-hidden"
                    required
                    disabled={loading}
                />
            </div>
        </div>
    );
};
