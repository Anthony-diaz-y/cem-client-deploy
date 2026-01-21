"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";

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
  const { editCourse } = useSelector((state: RootState) => state.course);

  return (
    <div className="flex justify-end gap-x-3">
      <button
        onClick={onBack}
        className="rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-400 transition-colors"
      >
        Retroceder
      </button>
      <button
        onClick={onNext}
        disabled={loading}
        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default CourseBuilderNavigation;

