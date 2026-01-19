"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createCategory, getPublicCategories } from "@shared/services/adminAPI";
import { IoMdClose } from "react-icons/io";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

/**
 * Modal para crear una nueva categoría de curso
 * Incluye validación de formulario y manejo de estados de carga
 */
export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  token,
}: CreateCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>();

  const [loading, setLoading] = useState(false);

  // Maneja el envío del formulario y crea la categoría
  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const success = await createCategory(
        {
          name: data.name.trim(),
          description: data.description.trim(),
        },
        token
      );

      if (success) {
        // Refrescar categorías públicas para el catálogo
        try {
          await getPublicCategories();
        } catch (error) {
          console.error("Error al refrescar categorías públicas:", error);
          // No mostrar error al usuario, es solo un refresh
        }
        
        reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 w-full max-w-md m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-richblack-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-richblack-5">
            Crear Nueva Categoría
          </h2>
          <button
            onClick={onClose}
            className="text-richblack-400 hover:text-richblack-5 transition-colors"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="name">
              Nombre de la Categoría <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="name"
              placeholder="Ej: Programación, Diseño, Marketing..."
              {...register("name", { required: "El nombre es requerido" })}
              className="form-style w-full"
            />
            {errors.name && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="description">
              Descripción <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="description"
              placeholder="Describe brevemente qué tipo de cursos pertenecen a esta categoría..."
              {...register("description", { required: "La descripción es requerida" })}
              className="form-style resize-x-none min-h-[100px] w-full"
            />
            {errors.description && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-richblack-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-200 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

