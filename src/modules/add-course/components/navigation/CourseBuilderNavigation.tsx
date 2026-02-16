"use client";

import React from "react";

interface CourseBuilderNavigationProps {
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

// Navegación del constructor de cursos
const CourseBuilderNavigation: React.FC<CourseBuilderNavigationProps> = ({
  loading,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex justify-end gap-x-3">
      <button
        onClick={onBack}
        className="rounded-md bg-cem-neutral-gray-200 py-[8px] px-[20px] font-semibold text-cem-neutral-gray-900 hover:bg-cem-neutral-gray-300 transition-colors"
      >
        Retroceder
      </button>
      <button
        onClick={onNext}
        disabled={loading}
        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-cem-primary py-[8px] px-[20px] font-semibold text-white hover:bg-cem-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default CourseBuilderNavigation;
