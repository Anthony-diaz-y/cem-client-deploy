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
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-full border-4"
              style={{
                borderColor: "rgba(2, 129, 158, 0.2)",
                borderTopColor: "#02819E",
                borderRightColor: "#02819E",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full border-4"
              style={{
                borderColor: "transparent",
                borderBottomColor: "#14b8a6",
                borderLeftColor: "#14b8a6",
                animation: "spin-reverse 0.8s linear infinite",
              }}
            />
          </div>
          <p className="mt-6 text-cem-neutral-gray-600 font-medium">
            Cargando cursos...
          </p>
        </div>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

