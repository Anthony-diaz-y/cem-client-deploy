"use client";

import React from "react";
import { CoursesSectionHeader } from "./CoursesSectionHeader";

/**
 * Componente de loading spinner con los colores de la empresa CEM
 */
export const CoursesLoadingSpinner: React.FC = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <CoursesSectionHeader />

        <div className="flex flex-col items-center justify-center py-20">
          <div className="custom-loader"></div>
          <p className="mt-6 text-cem-neutral-gray-600 font-medium">
            Cargando cursos...
          </p>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
