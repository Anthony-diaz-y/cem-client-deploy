"use client";

import React, { useState } from "react";
import { Category } from "@shared/services/adminAPI";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import CategoryCard from "./components/CategoryCard";
import { useCategoriesTable } from "../../hooks/category/useCategoriesTable";
import { useAutoScroll } from "../../hooks/category/useAutoScroll";
import { FiChevronRight } from "react-icons/fi";

interface CategoriesTableProps {
  categories: Category[];
  token: string;
  onUpdate: (updatedCategories?: Category[]) => void;
}

/**
 * Tabla para mostrar todas las categorías del sistema con sus cursos
 * Permite arrastrar y soltar cursos entre categorías
 * Vista expandible para ver los cursos de cada categoría
 */
export default function CategoriesTable({
  categories,
  token,
  onUpdate,
}: CategoriesTableProps) {
  const {
    categoriesWithCourses,
    draggedCourse,
    dragOverCategory,
    toggleCategory,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useCategoriesTable({
    categories,
    token,
    onUpdate,
  });

  // Hook para scroll automático durante drag & drop
  const { containerRef } = useAutoScroll({
    isDragging: draggedCourse !== null,
    scrollSpeed: 15,
    scrollThreshold: 120,
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

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-cem-neutral-gray-100 text-center shadow-sm">
        <div className="bg-cem-neutral-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiChevronRight className="text-3xl text-cem-neutral-gray-300" />
        </div>
        <p className="text-cem-neutral-gray-800 text-xl font-bold">
          No hay categorías registradas
        </p>
        <p className="text-cem-neutral-gray-500 mt-2">
          Comienza creando una nueva categoría para organizar tus cursos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-cem-neutral-gray-100 rounded-[2.5rem] border border-cem-neutral-gray-200 overflow-hidden shadow-sm">
        <div className="space-y-4 p-6">
          {categoriesWithCourses.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              draggedCourse={draggedCourse}
              isDragOver={dragOverCategory === category.id}
              onToggle={toggleCategory}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

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
