import React from "react";
import { FiMove } from "react-icons/fi";

interface CategoryCardDragOverlayProps {
    isDragOver: boolean;
    draggedCourseName?: string;
}

export const CategoryCardDragOverlay: React.FC<CategoryCardDragOverlayProps> = ({
    isDragOver,
    draggedCourseName,
}) => {
    if (!isDragOver || !draggedCourseName) return null;

    return (
        <div className="px-6 pb-6 mt-2">
            <div className="border-2 border-dashed border-cem-primary rounded-2xl p-8 text-center bg-cem-primary/5 animate-pulse">
                <div className="w-12 h-12 bg-cem-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-cem-primary/20">
                    <FiMove className="text-xl" />
                </div>
                <p className="text-sm font-black text-cem-primary uppercase tracking-widest">
                    Soltar para mover &quot;{draggedCourseName}&quot;
                </p>
            </div>
        </div>
    );
};
