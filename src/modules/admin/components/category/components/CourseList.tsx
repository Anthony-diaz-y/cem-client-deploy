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
      <p className="text-xs font-black text-cem-neutral-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cem-primary"></span>
        Gestión individual de cursos:
      </p>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {courses.map((course) => {
          const isProcessingThis = processingCourse === course.id;
          const selectedCategoryId = courseCategoryMap[course.id] || otherCategories[0]?.id || "";

          return (
            <div
              key={course.id}
              className="bg-white border border-cem-neutral-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-cem-neutral-gray-900 mb-1 group-hover:text-cem-primary transition-colors">
                    {course.courseName}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-cem-neutral-gray-200"></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${course.status === "Published" ? "text-caribbeangreen-400" : "text-yellow-400"}`}>
                      {course.status === "Published" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  {/* Selector de categoría */}
                  {otherCategories.length > 0 && (
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => onCategoryChange(course.id, e.target.value)}
                      className="text-[11px] font-bold px-4 py-2 bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 rounded-xl text-cem-neutral-gray-900 focus:outline-none focus:ring-2 focus:ring-cem-primary/20 min-w-[150px] cursor-pointer"
                      disabled={isProcessingThis || isProcessing}
                    >
                      {otherCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {/* Botón cambiar categoría */}
                    {otherCategories.length > 0 && (
                      <button
                        onClick={() => onMoveCourse(course.id)}
                        disabled={isProcessingThis || isProcessing || !selectedCategoryId}
                        className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-cem-primary text-white rounded-xl hover:bg-cem-primary-dark transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
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
                      className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white text-red-500 border border-red-50 rounded-xl hover:bg-red-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                      title="Eliminar curso"
                    >
                      <FiTrash2 />
                      Baja
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

