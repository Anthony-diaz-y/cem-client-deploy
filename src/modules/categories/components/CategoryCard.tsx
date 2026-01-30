"use client";

import React from "react";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  icon?: React.ReactNode;
  variant?: "default" | "primary";
  onClick?: () => void;
  isActive?: boolean;
}

/** Card para mostrar una categoría individual con contador de cursos */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
  variant = "default",
  onClick,
  isActive = false,
}) => {
  const courseCount = category.courses?.length || 0;

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full sm:w-auto min-w-[280px] p-4 rounded-xl border transition-all duration-300 text-left
        flex items-center gap-4 hover:shadow-lg hover:-translate-y-1
        ${
          isActive
            ? "bg-cem-primary text-white border-cem-primary shadow-md transform -translate-y-1"
            : variant === "primary"
              ? "bg-white border-cem-neutral-gray-200 hover:border-cem-primary"
              : "bg-white border-cem-neutral-gray-200 hover:border-cem-primary"
        }
      `}
    >
      {/* Icono Container */}
      <div
        className={`
        w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-colors
        ${
          isActive
            ? "bg-white text-cem-primary"
            : "bg-cem-neutral-gray-50 text-cem-neutral-gray-600 group-hover:bg-cem-primary/10 group-hover:text-cem-primary"
        }
      `}
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <span
          className={`font-bold text-base mb-0.5 ${
            isActive
              ? "text-white"
              : "text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors"
          }`}
        >
          {category.name}
        </span>
        <span
          className={`text-xs ${
            isActive
              ? "text-white/80"
              : "text-cem-neutral-gray-500 group-hover:text-cem-neutral-gray-600"
          }`}
        >
          {courseCount} {courseCount === 1 ? "curso" : "cursos"}
        </span>
      </div>
    </button>
  );
};

export default CategoryCard;
