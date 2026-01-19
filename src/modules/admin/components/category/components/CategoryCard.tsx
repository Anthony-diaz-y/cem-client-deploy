/**
 * Componente para mostrar una tarjeta de categoría expandible
 */

import React from "react";
import { FiTrash2, FiEdit3, FiChevronDown, FiChevronRight, FiMove } from "react-icons/fi";
import type { Category } from "@shared/services/adminAPI";
import type { CourseItem } from "../types";
import CategoryCourseItem from "./CategoryCourseItem";

interface CategoryCardProps {
  category: Category & {
    courses?: CourseItem[];
    expanded?: boolean;
    loading?: boolean;
    courseCount?: number;
  };
  draggedCourse: {
    courseId: string;
    sourceCategoryId: string;
    courseName: string;
  } | null;
  isDragOver: boolean;
  onToggle: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onDragStart: (e: React.DragEvent, courseId: string, sourceCategoryId: string, courseName: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, categoryId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, categoryId: string) => void;
}

export default function CategoryCard({
  category,
  draggedCourse,
  isDragOver,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: CategoryCardProps) {
  const courseCount = category.courses?.length || 0;

  return (
    <div
      className={`bg-richblack-900/50 rounded-lg border transition-all ${
        isDragOver
          ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50"
          : "border-richblack-700"
      }`}
      onDragOver={(e) => {
        // Solo permitir dragOver si no es la misma categoría de origen
        if (draggedCourse && draggedCourse.sourceCategoryId !== category.id) {
          onDragOver(e, category.id);
        }
      }}
      onDragLeave={(e) => {
        // Prevenir que se dispare cuando pasamos sobre elementos hijos
        const currentTarget = e.currentTarget as HTMLElement;
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
          onDragLeave(e);
        }
      }}
      onDrop={(e) => onDrop(e, category.id)}
    >
      {/* Header de la categoría */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={(e) => {
              // Prevenir que se expanda durante drag & drop
              if (draggedCourse) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              onToggle(category.id);
            }}
            className="text-richblack-400 hover:text-richblack-5 transition-colors"
            title={category.expanded ? "Contraer" : "Expandir"}
            disabled={!!draggedCourse}
          >
            {category.expanded ? (
              <FiChevronDown className="text-xl" />
            ) : (
              <FiChevronRight className="text-xl" />
            )}
          </button>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-richblack-5">
              {category.name}
            </h3>
            <p className="text-sm text-richblack-400 mt-1">
              {category.description}
            </p>
            <p className="text-xs text-richblack-500 mt-1">
              {category.courseCount ?? courseCount} {(category.courseCount ?? courseCount) === 1 ? "curso" : "cursos"}
            </p>
          </div>
        </div>
        <div 
          className="flex items-center gap-2"
          onClick={(e) => {
            // Prevenir que los clics en botones activen el drag/drop
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!draggedCourse) {
                onEdit(category);
              }
            }}
            disabled={!!draggedCourse}
            className="px-3 py-2 text-sm font-medium text-blue-200 bg-blue-900/20 hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar categoría"
          >
            <FiEdit3 className="text-lg" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!draggedCourse) {
                onDelete(category);
              }
            }}
            disabled={!!draggedCourse}
            className="px-3 py-2 text-sm font-medium text-pink-200 bg-pink-900/20 hover:bg-pink-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar categoría"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>

      {/* Cursos de la categoría (expandible) */}
      {category.expanded && (
        <div className="px-4 pb-4 border-t border-richblack-700 mt-2 pt-4">
          {category.loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-richblack-400"></div>
              <p className="text-sm text-richblack-400 mt-2">
                Cargando cursos...
              </p>
            </div>
          ) : courseCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-richblack-400">
                Esta categoría no tiene cursos
              </p>
              <p className="text-xs text-richblack-500 mt-1">
                Arrastra cursos aquí desde otras categorías
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {category.courses?.map((course) => (
                <CategoryCourseItem
                  key={course.id}
                  course={course}
                  categoryId={category.id}
                  draggedCourse={draggedCourse}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Indicador visual cuando se arrastra sobre esta categoría */}
      {isDragOver && draggedCourse && (
        <div className="px-4 pb-4 mt-2">
          <div className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center bg-blue-500/5">
            <p className="text-sm font-medium text-blue-400">
              Soltar aquí para mover el curso "{draggedCourse.courseName}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

