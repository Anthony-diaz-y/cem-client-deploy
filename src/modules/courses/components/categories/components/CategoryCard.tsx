"use client";

import React from "react";
import type { Category } from "../../../types";
import {
  TbDna,
  TbHeartbeat,
  TbPlant,
  TbApple,
  TbLeaf,
  TbCpu,
} from "react-icons/tb";
import { IconType } from "react-icons";

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick: () => void;
}

const categoryIcons: Record<string, IconType> = {
  biología: TbDna,
  biotecnología: TbDna,
  ingeniería: TbCpu,
  biomédica: TbHeartbeat,
  agropecuarias: TbPlant,
  veterinaria: TbPlant,
  salud: TbHeartbeat,
  ambientales: TbLeaf,
  ecología: TbLeaf,
  alimentos: TbApple,
};

const getCategoryIcon = (categoryName: string): IconType => {
  const lowerName = categoryName.toLowerCase();
  const matchingKey = Object.keys(categoryIcons).find((key) =>
    lowerName.includes(key),
  );
  return matchingKey ? categoryIcons[matchingKey] : TbDna;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isActive,
  onClick,
}) => {
  const Icon = getCategoryIcon(category.name);

  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex items-center gap-3 px-4 py-3 border rounded-full transition-all duration-200 text-sm font-medium ${
        isActive
          ? "bg-cem-primary text-white border-cem-primary"
          : "bg-white text-gray-700 border-gray-300 hover:border-cem-primary hover:text-cem-primary"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{category.name}</span>
    </button>
  );
};
