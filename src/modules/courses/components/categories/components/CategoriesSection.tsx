"use client";

import React from "react";
import { CategoryCard } from "./CategoryCard";
import type { Category } from "../../../types";
import { TbGridDots } from "react-icons/tb";

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryName: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white pb-8">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Botón "Todas" */}
          <button
            onClick={() => onCategorySelect("")}
            className={`relative z-10 flex items-center gap-3 px-4 py-3 border rounded-full transition-all duration-200 text-sm font-medium ${
              !selectedCategory
                ? "bg-cem-primary text-white border-cem-primary"
                : "bg-white text-gray-700 border-gray-300 hover:border-cem-primary hover:text-cem-primary"
            }`}
          >
            <TbGridDots className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Todas las categorías</span>
          </button>

          {/* Categorías dinámicas */}
          {categories.map((category) => (
            <CategoryCard
              key={category.id || category._id || category.name}
              category={category}
              isActive={selectedCategory === category.name}
              onClick={() => onCategorySelect(category.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
