/**
 * Componente principal para mostrar una tarjeta de categoría expandible
 */

import React from "react";
import { CategoryCardProps } from "./interfaces/CategoryCard.interface";
import { CategoryCardHeader } from "./components/CategoryCardHeader";
import { CategoryCardContent } from "./components/CategoryCardContent";
import { useCategoryCard } from "./hooks/useCategoryCard";

export default function CategoryCard(props: CategoryCardProps) {
  const {
    category,
  } = props;

  const { courseCount } = useCategoryCard(props);

  return (
    <div
      className="bg-cem-neutral-gray-50/30 rounded-2xl border border-cem-neutral-gray-100 bg-white transition-all duration-300"
    >
      <CategoryCardHeader
        category={category}
        onToggle={props.onToggle}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        courseCount={courseCount}
      />

      <CategoryCardContent
        category={category}
        courseCount={courseCount}
      />
    </div>
  );
}
