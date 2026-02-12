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
  name: string;
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
    <div className="bg-white rounded-2xl border border-cem-neutral-gray-100 p-8 space-y-6 shadow-sm">
      {/* Barra de búsqueda */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-cem-neutral-gray-800 ml-1">
          Buscar curso
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            e.preventDefault();
            onSearchChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          placeholder="Buscar por nombre de curso, descripción o instructor..."
          className="w-full h-[56px] px-6 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:border-cem-primary transition-all shadow-sm"
          autoComplete="off"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filtro por estado */}
        <CustomDropdown
          label="Estado"
          value={statusFilter}
          onChange={(value) => onStatusChange(value as typeof statusFilter)}
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
              label: instructor.name,
            })),
          ]}
          placeholder="Seleccionar instructor"
        />
      </div>
    </div>
  );
}
