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
    domainId: string;
    setDomainId: (id: string) => void;
    domains: Array<{ id: string; name: string }>;
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
    domainId,
    setDomainId,
    domains,
    loading,
}) => {
    return (
        <div className="flex-1 py-2 space-y-4 flex flex-col items-center justify-center">
            {/* Tipo de categoría (Dominio) */}
            <div className="w-[744px] flex flex-col space-y-1 flex-shrink-0">
                <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
                    Tipo de categoría<span className="text-red-500">*</span>
                </label>
                <select
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    className="w-full h-[56px] px-6 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all appearance-none cursor-pointer"
                    disabled={loading}
                    required
                >
                    <option value="" disabled>Elige si es carrera o sector</option>
                    {domains
                        .filter(d => !d.name.toLowerCase().includes("ruta"))
                        .map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.id === "9729864d-9669-450f-90e6-b080517f694a" || d.name.toLowerCase().includes("sector")
                                    ? "Sector"
                                    : "Carrera"}
                            </option>
                        ))}
                </select>
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

            {/* Ícono SVG */}
            <SvgIconUploader value={icon} onChange={setIcon} disabled={loading} />
        </div>
    );
};
