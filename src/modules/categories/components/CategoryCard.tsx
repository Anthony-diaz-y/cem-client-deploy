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
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full sm:w-auto xl:min-h-[44px] p-2.5 xl:py-2 xl:px-6 rounded-xl border transition-all duration-300
        flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-0.5
        ${isActive
          ? "bg-cem-primary text-white border-cem-primary shadow-md"
          : variant === "primary"
            ? "bg-white border-cem-neutral-gray-200 hover:border-cem-primary"
            : "bg-white border-cem-neutral-gray-200 hover:border-cem-primary"
        }
      `}
    >
      {/* Icono Container */}
      <div
        className={`
        w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors flex-shrink-0
        ${isActive
            ? "bg-white text-cem-primary"
            : "bg-cem-neutral-gray-50 text-cem-neutral-gray-600 group-hover:bg-cem-primary/10 group-hover:text-cem-primary"
          }
      `}
      >
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className={`font-semibold text-[14px] xl:text-[15px] whitespace-nowrap ${isActive
            ? "text-white"
            : "text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors"
            }`}
        >
          {category.name}
        </span>
      </div>
    </button>
  );
};

export default CategoryCard;
