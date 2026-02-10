"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FiEdit3, FiRefreshCw } from "react-icons/fi";
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
  const [loading, setLoading] = useState(false);

  // Actualizar estado cuando cambia la categoría
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [category]);

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
    } catch (error: any) {
      // Error ya manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cem-neutral-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 w-full max-w-md shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="px-8 py-6 border-b border-cem-neutral-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cem-primary/10 flex items-center justify-center shadow-sm">
              <FiEdit3 className="text-2xl text-cem-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-cem-neutral-gray-900">
                Editar Categoría
              </h2>
              <p className="text-xs text-cem-neutral-gray-500 font-bold uppercase tracking-widest mt-0.5">Gestión de categorías</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-10 h-10 rounded-full flex items-center justify-center text-cem-neutral-gray-400 hover:bg-cem-neutral-gray-50 hover:text-cem-neutral-gray-900 transition-all border border-transparent hover:border-cem-neutral-gray-100 disabled:opacity-50"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-black text-cem-neutral-gray-900 uppercase tracking-widest flex items-center gap-1" htmlFor="name">
              Nombre de la Categoría <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Programación, Diseño, Marketing..."
              className="w-full px-6 py-4 bg-cem-neutral-gray-50/50 border border-cem-neutral-gray-100 rounded-2xl text-cem-neutral-gray-900 font-bold placeholder-cem-neutral-gray-300 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-black text-cem-neutral-gray-900 uppercase tracking-widest flex items-center gap-1" htmlFor="description">
              Descripción <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente el alcance de esta categoría..."
              rows={4}
              className="w-full px-6 py-4 bg-cem-neutral-gray-50/50 border border-cem-neutral-gray-100 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-300 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm resize-none"
              required
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-cem-neutral-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 md:flex-none px-8 py-3.5 bg-white text-cem-neutral-gray-500 border border-cem-neutral-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cem-neutral-gray-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-8 py-3.5 bg-cem-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-lg" />
                  Guardando...
                </>
              ) : (
                <>
                  <FiEdit3 className="text-lg" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

