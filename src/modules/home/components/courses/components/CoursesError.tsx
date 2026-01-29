"use client";

import React from "react";
import { CoursesSectionHeader } from "./CoursesSectionHeader";

/**
 * Componente de error para cuando no se pueden cargar los cursos
 */
export const CoursesError: React.FC = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <CoursesSectionHeader />

        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-cem-neutral-gray-900 mb-2">
            No se pudieron cargar los cursos
          </h3>
          <p className="text-cem-neutral-gray-600 text-center max-w-md mb-6">
            Lo sentimos, ha ocurrido un error al intentar cargar los cursos. Por
            favor, intenta recargar la página o vuelve más tarde.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cem-primary text-white rounded-lg font-medium hover:bg-cem-teal-600 transition-colors duration-200"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
};

