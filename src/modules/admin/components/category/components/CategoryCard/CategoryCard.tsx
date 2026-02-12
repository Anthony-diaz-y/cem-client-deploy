/**
 * Componente principal para mostrar una tarjeta de categoría expandible
 */

import React from "react";
import { CategoryCardProps } from "./interfaces/CategoryCard.interface";
import { CategoryCardHeader } from "./components/CategoryCardHeader";
import { CategoryCardContent } from "./components/CategoryCardContent";
import { CategoryCardDragOverlay } from "./components/CategoryCardDragOverlay";
import { useCategoryCard } from "./hooks/useCategoryCard";

export default function CategoryCard(props: CategoryCardProps) {
  const {
    category,
    draggedCourse,
    isDragOver,
    onDrop,
  } = props;

  const { handleDragOver, handleDragLeave, courseCount } = useCategoryCard(props);

  return (
    <div
      className={`bg-cem-neutral-gray-50/30 rounded-2xl border transition-all duration-300 ${isDragOver
        ? "border-cem-primary bg-cem-primary/5 ring-4 ring-cem-primary/10 shadow-lg"
        : "border-cem-neutral-gray-100 bg-white"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => onDrop(e, category.id)}
    >
      <CategoryCardHeader
        category={category}
        draggedCourse={draggedCourse}
        onToggle={props.onToggle}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        courseCount={courseCount}
      />

      <CategoryCardContent
        category={category}
        draggedCourse={draggedCourse}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        courseCount={courseCount}
      />

      <CategoryCardDragOverlay
        isDragOver={isDragOver}
        draggedCourseName={draggedCourse?.courseName}
      />
    </div>
  );
}
