"use client";

import { useState } from "react";
import { useAppSelector } from "@shared/store/hooks";
import CategoriesTable from "../components/category/CategoriesTable";
import CreateCategoryModal from "../components/category/CreateCategoryModal";
import { Loading } from "@shared/components";
import { useCategories } from "../hooks/category/useCategories";
import { ActionButton } from "../components/shared/ActionButton";

export default function CategoriesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const { categories, loading, refreshCategories } = useCategories(token);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 xl:pr-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-cem-neutral-gray-900">
          Gestión de Categorías
        </h1>
        <p className="text-cem-neutral-gray-600">
          Administra las categorías del sistema. Visualiza, crea y elimina categorías.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <ActionButton
            label="Crear categoría"
            onClick={() => setIsCreateCategoryModalOpen(true)}
          />
        </div>
      </div>

      <CategoriesTable
        categories={categories}
        token={token}
        onUpdate={async (updatedCategories) => {
          if (updatedCategories) {
            await refreshCategories();
          } else {
            await refreshCategories();
          }
        }}
      />

      {isCreateCategoryModalOpen && token && (
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={async () => {
            await refreshCategories();
          }}
          token={token}
        />
      )}
    </div>
  );
}
