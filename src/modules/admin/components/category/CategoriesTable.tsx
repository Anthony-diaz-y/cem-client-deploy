"use client";

import React, { useState } from "react";
import { Category } from "@shared/services/adminAPI";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import CategoryCard from "./components/CategoryCard";
import { useCategoriesTable } from "./hooks/useCategoriesTable";
import { useAutoScroll } from "./hooks/useAutoScroll";

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
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay categorías registradas
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
        <div className="space-y-2 p-4">
          {categoriesWithCourses.map((category) => (
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
