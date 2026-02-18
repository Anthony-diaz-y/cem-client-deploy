"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiFolderPlus } from "react-icons/fi";
import { createCategory, getPublicCategories } from "@shared/services/adminAPI";
import { CategoryFormFields } from "./components/CategoryFormFields";
import { CategoryModalLayout } from "./components/CategoryModalLayout";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

/**
 * Modal para crear una nueva categoría de curso
 * Reutiliza el diseño y componentes de EditCategoryModal
 */
export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  token,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Maneja el envío del formulario y crea la categoría
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast.error("Nombre y descripción son requeridos");
      return;
    }

    setLoading(true);
    try {
      const success = await createCategory(
        {
          name: name.trim(),
          description: description.trim(),
        },
        token
      );

      if (success) {
        // Refrescar categorías públicas para el catálogo
        try {
          await getPublicCategories();
        } catch (error) {
          console.error("Error al refrescar categorías públicas:", error);
        }

        // Disparar evento personalizado
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('categoriesUpdated'));
        }

        // Reset states
        setName("");
        setDescription("");
        setCategoryType("");

        onSuccess();
        onClose();
        toast.success("Categoría creada exitosamente");
      }
    } catch {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nueva Categoría"
      icon={<FiFolderPlus className="text-2xl text-cem-primary" />}
      loading={loading}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-10 py-4 bg-[#DCEEEF] text-cem-primary rounded-lg font-bold text-lg hover:bg-[#D5E8E9] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-10 py-4 bg-cem-primary text-white rounded-lg font-bold text-lg hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {loading ? "Creando..." : "Crear Categoría"}
          </button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex-1 flex flex-col items-center justify-center">
        <CategoryFormFields
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          categoryType={categoryType}
          setCategoryType={setCategoryType}
          isSelectOpen={isSelectOpen}
          setIsSelectOpen={setIsSelectOpen}
          loading={loading}
        />
      </form>
    </CategoryModalLayout>
  );
}
