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
      className={`bg-cem-neutral-gray-50/30 rounded-[2rem] border transition-all duration-300 ${isDragOver
        ? "border-cem-primary bg-cem-primary/5 ring-4 ring-cem-primary/10 shadow-lg"
        : "border-cem-neutral-gray-100 bg-white"
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
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4 flex-1">
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${category.expanded
              ? "bg-cem-primary text-white shadow-md shadow-cem-primary/20"
              : "bg-cem-neutral-gray-50 text-cem-neutral-gray-400 hover:bg-cem-neutral-gray-100 hover:text-cem-neutral-gray-600"
              }`}
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
            <h3 className="text-lg font-black text-cem-neutral-gray-900 leading-tight">
              {category.name}
            </h3>
            <p className="text-sm text-cem-neutral-gray-500 font-medium mt-0.5">
              {category.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-cem-celeste-light text-cem-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-cem-celeste-DEFAULT">
                {category.courseCount ?? courseCount} {(category.courseCount ?? courseCount) === 1 ? "curso" : "cursos"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3"
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
            className="w-10 h-10 flex items-center justify-center text-cem-primary bg-white border border-cem-neutral-gray-100 rounded-xl hover:bg-cem-primary hover:text-white hover:border-cem-primary transition-all duration-300 shadow-sm disabled:opacity-50"
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
            className="w-10 h-10 flex items-center justify-center text-red-500 bg-white border border-red-50 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm disabled:opacity-50"
            title="Eliminar categoría"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>

      {/* Cursos de la categoría (expandible) */}
      {category.expanded && (
        <div className="px-6 pb-6 border-t border-cem-neutral-gray-50/50 mt-2 pt-6 bg-cem-neutral-gray-50/10 rounded-b-[2rem]">
          {category.loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                Cargando cursos...
              </p>
            </div>
          ) : courseCount === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-cem-neutral-gray-200">
              <div className="w-12 h-12 rounded-full bg-cem-neutral-gray-50 flex items-center justify-center mx-auto mb-4">
                <FiMove className="text-xl text-cem-neutral-gray-300" />
              </div>
              <p className="text-sm font-bold text-cem-neutral-gray-900">
                Esta categoría no tiene cursos
              </p>
              <p className="text-xs text-cem-neutral-gray-400 mt-1 font-medium italic">
                Arrastra cursos aquí desde otras categorías para organizarlos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="px-6 pb-6 mt-2">
          <div className="border-2 border-dashed border-cem-primary rounded-2xl p-8 text-center bg-cem-primary/5 animate-pulse">
            <div className="w-12 h-12 bg-cem-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-cem-primary/20">
              <FiMove className="text-xl" />
            </div>
            <p className="text-sm font-black text-cem-primary uppercase tracking-widest">
              Soltar para mover "{draggedCourse.courseName}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

