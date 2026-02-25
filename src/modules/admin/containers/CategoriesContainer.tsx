"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@shared/store/hooks";
import CategoriesTable from "../components/category/CategoriesTable";
import CreateCategoryModal from "../components/category/CreateCategoryModal";
import { Loading } from "@shared/components";
import { useCategories } from "../hooks/category/useCategories";
import { ActionButton } from "../components/shared/ActionButton";

export default function CategoriesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const { categories, loading, refreshCategories } = useCategories(token);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter categories based on search term and type filter
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const name = category.name || "";
      const description = category.description || "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());

      // Default to career if type is missing for backward compatibility/demo
      const categoryType =
        category.type ||
        (name.toLowerCase().includes("carrera") ? "career" : "sector");

      const matchesType = typeFilter === "all" || categoryType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [categories, searchTerm, typeFilter]);

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-cem-neutral-gray-900">
            Gestión de Categorías
          </h1>
          <p className="text-cem-neutral-gray-600">
            Administra las categorías del sistema. Visualiza, crea y elimina
            categorías.
          </p>
        </div>
        <div>
          <ActionButton
            label="Crear categoría"
            onClick={() => setIsCreateCategoryModalOpen(true)}
          />
        </div>
      </div>

      <CategoriesTable
        categories={filteredCategories}
        token={token}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onUpdate={async () => {
          await refreshCategories();
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
