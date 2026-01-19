/**
 * Componente para mostrar la lista de cursos en el modal de eliminación de categorías
 */

import React from "react";
import { FiTrash2, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import type { CourseItem } from "../types";
import type { Category } from "@shared/services/adminAPI";

interface CourseListProps {
  courses: CourseItem[];
  otherCategories: Category[];
  courseCategoryMap: Record<string, string>;
  processingCourse: string | null;
  isProcessing: boolean;
  onCategoryChange: (courseId: string, categoryId: string) => void;
  onMoveCourse: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
}

export default function CourseList({
  courses,
  otherCategories,
  courseCategoryMap,
  processingCourse,
  isProcessing,
  onCategoryChange,
  onMoveCourse,
  onDeleteCourse,
}: CourseListProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-sm font-medium text-richblack-5 mb-3">
        Gestionar cursos individualmente:
      </p>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {courses.map((course) => {
          const isProcessingThis = processingCourse === course.id;
          const selectedCategoryId = courseCategoryMap[course.id] || otherCategories[0]?.id || "";

          return (
            <div
              key={course.id}
              className="bg-richblack-700/50 border border-richblack-600 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-richblack-5 mb-1">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-richblack-400">
                    {course.instructor.firstName} {course.instructor.lastName} •{" "}
                    {course.status === "Published" ? "Publicado" : "Borrador"}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Selector de categoría */}
                  {otherCategories.length > 0 && (
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => onCategoryChange(course.id, e.target.value)}
                      className="form-style text-xs py-1.5 px-2 min-w-[140px]"
                      disabled={isProcessingThis || isProcessing}
                    >
                      {otherCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Botón cambiar categoría */}
                  {otherCategories.length > 0 && (
                    <button
                      onClick={() => onMoveCourse(course.id)}
                      disabled={isProcessingThis || isProcessing || !selectedCategoryId}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Cambiar categoría"
                    >
                      {isProcessingThis ? (
                        <FiRefreshCw className="animate-spin" />
                      ) : (
                        <FiArrowRight />
                      )}
                      Mover
                    </button>
                  )}

                  {/* Botón eliminar curso */}
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    disabled={isProcessingThis || isProcessing}
                    className="px-3 py-1.5 text-xs font-medium bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    title="Eliminar curso"
                  >
                    <FiTrash2 />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

