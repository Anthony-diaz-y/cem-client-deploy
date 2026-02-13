import React, { useCallback } from "react";
import type { CategoryCardProps } from "../interfaces/CategoryCard.interface";

export const useCategoryCard = (props: CategoryCardProps) => {
    const { category, draggedCourse, onDragOver, onDragLeave } = props;

    const handleDragOver = useCallback((e: React.DragEvent) => {
        // Solo permitir dragOver si no es la misma categoría de origen
        if (draggedCourse && draggedCourse.sourceCategoryId !== category.id) {
            onDragOver(e, category.id);
        }
    }, [category.id, draggedCourse, onDragOver]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        // Prevenir que se dispare cuando pasamos sobre elementos hijos
        const currentTarget = e.currentTarget as HTMLElement;
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
            onDragLeave(e);
        }
    }, [onDragLeave]);

    const courseCount = category.courses?.length || 0;

    return {
        handleDragOver,
        handleDragLeave,
        courseCount
    };
};
