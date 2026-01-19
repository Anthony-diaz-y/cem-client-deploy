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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 w-full max-w-md m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-richblack-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FiEdit3 className="text-xl text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-richblack-5">
              Editar Categoría
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-richblack-400 hover:text-richblack-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="name">
              Nombre de la Categoría <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Programación, Diseño, Marketing..."
              className="form-style w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="description">
              Descripción <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe la categoría..."
              rows={4}
              className="form-style w-full resize-none"
              required
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-richblack-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FiEdit3 />
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

