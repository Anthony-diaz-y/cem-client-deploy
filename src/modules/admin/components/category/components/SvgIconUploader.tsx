"use client";

import React, { useRef, useState } from "react";
import { FiUpload, FiX, FiAlertCircle } from "react-icons/fi";

interface SvgIconUploaderProps {
    value: string;        // contenido SVG como string (o vacío)
    onChange: (svgContent: string) => void;
    disabled?: boolean;
}

const MAX_SVG_SIZE_KB = 100; // límite razonable para un ícono

/**
 * Uploader de íconos SVG para categorías.
 * Lee el archivo SVG del disco y lo almacena como string para enviarlo al backend.
 */
export const SvgIconUploader: React.FC<SvgIconUploaderProps> = ({
    value,
    onChange,
    disabled = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        setError("");

        if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
            setError("Solo se permiten archivos .svg");
            return;
        }

        if (file.size > MAX_SVG_SIZE_KB * 1024) {
            setError(`El archivo no debe superar ${MAX_SVG_SIZE_KB}KB`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            // Validación básica: debe tener etiqueta <svg
            if (!text.includes("<svg")) {
                setError("El archivo no parece ser un SVG válido");
                return;
            }
            onChange(text);
        };
        reader.readAsText(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        // Reset input para permitir volver a seleccionar el mismo archivo
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleClear = () => {
        setError("");
        onChange("");
    };

    return (
        <div className="w-full max-w-[744px] flex flex-col space-y-1">
            <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
                Ícono de la categoría{" "}
                <span className="text-cem-neutral-gray-400 font-normal">(SVG, opcional)</span>
            </label>

            {/* Zona de drop / preview */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative w-full h-[96px] rounded-2xl border-2 border-dashed transition-all flex items-center gap-5 px-6
          ${isDragging
                        ? "border-cem-primary bg-cem-primary/5 scale-[1.01]"
                        : value
                            ? "border-cem-teal-100 bg-cem-teal-50/40"
                            : "border-cem-neutral-gray-300 bg-cem-neutral-gray-50/50 hover:border-cem-primary/50 hover:bg-cem-primary/5"
                    }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                {/* Preview del SVG */}
                {value ? (
                    <>
                        {/* Renderizado inline del SVG */}
                        <div
                            className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-cem-primary [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current"
                            dangerouslySetInnerHTML={{ __html: value }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-cem-neutral-gray-800">
                                Ícono cargado exitosamente
                            </p>
                            <p className="text-xs text-cem-neutral-gray-400 mt-0.5">
                                Haz clic para cambiar el archivo SVG
                            </p>
                        </div>
                        {/* Botón para quitar el ícono */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleClear(); }}
                            disabled={disabled}
                            className="flex-shrink-0 p-2 rounded-full hover:bg-red-50 text-cem-neutral-gray-400 hover:text-red-500 transition-colors"
                            title="Quitar ícono"
                        >
                            <FiX size={18} />
                        </button>
                    </>
                ) : (
                    /* Estado vacío */
                    <>
                        <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors
              ${isDragging ? "bg-cem-primary/10 text-cem-primary" : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"}`}
                        >
                            <FiUpload size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-cem-neutral-gray-700">
                                {isDragging ? "Suelta el archivo aquí" : "Subir ícono SVG"}
                            </p>
                            <p className="text-xs text-cem-neutral-gray-400 mt-0.5">
                                Arrastra un archivo .svg o haz clic para seleccionarlo · Máx. {MAX_SVG_SIZE_KB}KB
                            </p>
                        </div>
                    </>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-500 ml-1 mt-0.5">
                    <FiAlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}

            {/* Hint cuando no hay ícono */}
            {!value && !error && (
                <p className="text-xs text-cem-neutral-gray-400 ml-1">
                    Si no subes uno, el ícono se asignará automáticamente según el nombre de la categoría
                </p>
            )}
        </div>
    );
};
