"use client";

import React from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { COURSE_STATUS } from "@shared/utils/constants";

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
}

interface CourseFiltersProps {
  statusFilter: "all" | "Draft" | "Published";
  categoryFilter: string;
  instructorFilter: string;
  searchQuery: string;
  categories: Category[];
  instructors: Instructor[];
  onStatusChange: (value: "all" | "Draft" | "Published") => void;
  onCategoryChange: (value: string) => void;
  onInstructorChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

/**
 * Componente de filtros para la tabla de cursos
 * Incluye filtros por estado, categoría, instructor y búsqueda
 */
export default function CourseFilters({
  statusFilter,
  categoryFilter,
  instructorFilter,
  searchQuery,
  categories,
  instructors,
  onStatusChange,
  onCategoryChange,
  onInstructorChange,
  onSearchChange,
}: CourseFiltersProps) {
  return (
    <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6 space-y-4">
      {/* Barra de búsqueda */}
      <div>
        <label className="block text-sm font-medium text-richblack-300 mb-2">
          Buscar curso
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre de curso, descripción o instructor..."
          className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
        {/* Filtro por estado */}
        <CustomDropdown
          label="Estado"
          value={statusFilter}
          onChange={(value) =>
            onStatusChange(value as typeof statusFilter)
          }
          options={[
            { value: "all", label: "Todos" },
            { value: COURSE_STATUS.DRAFT, label: "Borrador" },
            { value: COURSE_STATUS.PUBLISHED, label: "Publicado" },
          ]}
          placeholder="Seleccionar estado"
        />

        {/* Filtro por categoría */}
        <CustomDropdown
          label="Categoría"
          value={categoryFilter}
          onChange={onCategoryChange}
          options={[
            { value: "all", label: "Todas" },
            ...categories.map((category) => {
              const categoryId = category.id || "";
              return {
                value: categoryId,
                label: category.name,
              };
            }),
          ]}
          placeholder="Seleccionar categoría"
        />

        {/* Filtro por instructor */}
        <CustomDropdown
          label="Instructor"
          value={instructorFilter}
          onChange={onInstructorChange}
          options={[
            { value: "all", label: "Todos" },
            ...instructors.map((instructor) => ({
              value: instructor.id,
              label: `${instructor.firstName} ${instructor.lastName}`,
            })),
          ]}
          placeholder="Seleccionar instructor"
        />
      </div>
    </div>
  );
}

