"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiEdit3 } from "react-icons/fi";
import { Category, updateCategory, getPublicCategories } from "@shared/services/adminAPI";
import { CategoryFormFields } from "./components/CategoryFormFields";
import { CategoryModalLayout } from "./components/CategoryModalLayout";

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
  const [icon, setIcon] = useState("");
  const [domainId, setDomainId] = useState("");
  const [domains, setDomains] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Cargar dominios al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const fetchDomains = async () => {
        try {
          const { getAllDomains } = await import("../../../../modules/categories/services/domainsAPI");
          const data = await getAllDomains();
          setDomains(data || []);
        } catch (error) {
          console.error("Error fetching domains:", error);
        }
      };
      fetchDomains();
    }
  }, [isOpen]);

  // Cargar datos al abrir
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIcon(category.icon || "");
      setDomainId(category.domain?.id || "");
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !domainId) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const result = await updateCategory(
        category.id,
        name.trim(),
        description.trim(),
        token,
        icon || undefined,
        domainId,
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
    <CategoryModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Categoría"
      icon={<FiEdit3 className="text-2xl text-cem-primary" />}
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
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 bg-cem-primary text-white rounded-lg font-bold text-lg hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col items-center justify-center">
        <CategoryFormFields
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          icon={icon}
          setIcon={setIcon}
          domainId={domainId}
          setDomainId={setDomainId}
          domains={domains}
          loading={loading}
        />
      </form>
    </CategoryModalLayout>
  );
}


