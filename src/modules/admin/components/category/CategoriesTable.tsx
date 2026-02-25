"use client";

import React, { useState } from "react";
import { Category } from "@shared/services/adminAPI";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import { useCategoriesTable } from "../../hooks/category/useCategoriesTable";
import { FiChevronRight } from "react-icons/fi";
import CustomDropdown from "../dropdown/CustomDropdown";

interface CategoriesTableProps {
  categories: Category[];
  token: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  onUpdate: (updatedCategories?: Category[]) => void;
}

/**
 * Tabla para mostrar todas las categorías del sistema con sus cursos
 * Vista expandible para ver los cursos de cada categoría
 */
export default function CategoriesTable({
  categories,
  token,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  onUpdate,
}: CategoriesTableProps) {
  const {
    categoriesWithCourses,
    toggleCategory,
  } = useCategoriesTable({
    categories,
    token,
    onUpdate,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null,
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null,
  });

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({
      isOpen: true,
      category,
    });
  };

  const handleEditClick = (category: Category) => {
    setEditModal({
      isOpen: true,
      category,
    });
  };

  const typeOptions = [
    { value: "all", label: "Todos" },
    { value: "career", label: "Carrera" },
    { value: "sector", label: "Sector" },
  ];

  return (
    <>
      {/* Filtros de búsqueda y tipo */}
      <div className="bg-white rounded-2xl p-6 border border-cem-neutral-gray-100 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-cem-neutral-gray-700 ml-1 block">
            Buscar categoría
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-4 pr-4 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-lg text-sm text-cem-neutral-gray-900 focus:bg-white focus:border-cem-primary transition-all outline-none font-medium"
            />
          </div>
        </div>
        <div className="space-y-0">
          <div className="w-full">
            <CustomDropdown
              label="Tipo"
              value={typeFilter}
              options={typeOptions}
              onChange={setTypeFilter}
              placeholder="Seleccionar tipo"
            />
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-cem-neutral-gray-100 text-center shadow-sm">
          <div className="bg-cem-neutral-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiChevronRight className="text-3xl text-cem-neutral-gray-300" />
          </div>
          <p className="text-cem-neutral-gray-800 text-xl font-bold">
            No se encontraron categorías
          </p>
          <p className="text-cem-neutral-gray-500 mt-2">
            Intenta con otros términos de búsqueda o filtros.
          </p>
        </div>
      ) : (
        <div className="bg-cem-neutral-gray-100 rounded-[2.5rem] border border-cem-neutral-gray-200 overflow-hidden shadow-sm">
          <div className="space-y-4 p-6">
            {categoriesWithCourses.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onToggle={toggleCategory}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editModal.isOpen && editModal.category && (
        <EditCategoryModal
          isOpen={editModal.isOpen}
          category={editModal.category}
          token={token}
          onClose={() => setEditModal({ isOpen: false, category: null })}
          onSuccess={() => {
            setEditModal({ isOpen: false, category: null });
            onUpdate();
          }}
        />
      )}

      {/* Modal de eliminación */}
      {deleteModal.isOpen && deleteModal.category && (
        <DeleteCategoryModal
          isOpen={deleteModal.isOpen}
          category={deleteModal.category}
          token={token}
          onClose={() => setDeleteModal({ isOpen: false, category: null })}
          onSuccess={(updatedCategories) => {
            setDeleteModal({ isOpen: false, category: null });
            onUpdate(updatedCategories);
          }}
        />
      )}
    </>
  );
}
