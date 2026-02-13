"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { Category, updateCategory, getPublicCategories } from "@shared/services/adminAPI";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  token: string;
  onSuccess: () => void;
}

/**
 * Modal para editar una categoría existente
 * Incluye validación de formulario y manejo de estados de carga
 */
export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  token,
  onSuccess,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Actualizar estado cuando cambia la categoría
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      // Mockup: assume career/sector based on name or description if not in data
      // For now we keep it empty or as per real data if available
    }
  }, [category]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => setIsSelectOpen(false);
    if (isSelectOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isSelectOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const result = await updateCategory(
        category.id,
        name.trim(),
        description.trim(),
        token
      );

      if (result) {
        // Refrescar categorías públicas para el catálogo
        try {
          await getPublicCategories();
        } catch (error) {
          console.error("Error al refrescar categorías públicas:", error);
          // No mostrar error al usuario, es solo un refresh
        }

        // Disparar evento personalizado para notificar a otros componentes (Navbar, etc.)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('categoriesUpdated'));
        }

        onSuccess();
        onClose();
      }
    } catch {
      // Error ya manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cem-neutral-gray-900/40 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl border border-cem-neutral-gray-100 flex flex-col shadow-2xl animate-scaleIn overflow-hidden"
        style={{ width: '792px', height: '512px' }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between flex-shrink-0 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cem-primary/10 flex items-center justify-center shadow-sm">
              <FiEdit3 className="text-2xl text-cem-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-cem-neutral-gray-900">
              Editar Categoría
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-cem-neutral-gray-400 hover:text-cem-neutral-gray-900 transition-all p-1"
          >
            <IoMdClose className="text-3xl" />
          </button>
          {/* Divider matched to input width */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[744px] h-[1px] bg-cem-neutral-gray-100" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-2 space-y-4 flex flex-col items-center justify-center">
          {/* Tipo de categoría - Custom Select */}
          <div className="w-[744px] flex flex-col space-y-1 z-20">
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
        </form>

        {/* Footer */}
        <div className="px-6 py-5 flex items-center justify-end gap-4 bg-white flex-shrink-0 relative">
          {/* Divider matched to input width */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[744px] h-[1px] bg-cem-neutral-gray-100" />

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-10 py-4 bg-[#DCEEEF] text-cem-primary rounded-lg font-bold text-lg hover:bg-[#D5E8E9] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 bg-cem-primary text-white rounded-lg font-bold text-lg hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}


