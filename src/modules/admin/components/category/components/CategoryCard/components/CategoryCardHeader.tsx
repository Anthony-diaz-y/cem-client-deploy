import React from "react";
import { FiChevronDown, FiChevronRight, FiEdit3, FiTrash2 } from "react-icons/fi";
import type { CategoryCardProps } from "../interfaces/CategoryCard.interface";

interface CategoryCardHeaderProps extends Pick<CategoryCardProps,
    'category' | 'draggedCourse' | 'onToggle' | 'onEdit' | 'onDelete'
> {
    courseCount: number;
}

export const CategoryCardHeader: React.FC<CategoryCardHeaderProps> = ({
    category,
    draggedCourse,
    onToggle,
    onEdit,
    onDelete,
    courseCount,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
            <div className="flex gap-4 flex-1 items-center">
                <button
                    onClick={(e) => {
                        if (draggedCourse) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        onToggle(category.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center transition-all text-cem-neutral-gray-400 hover:text-cem-primary"
                    title={category.expanded ? "Contraer" : "Expandir"}
                    disabled={!!draggedCourse}
                >
                    {category.expanded ? (
                        <FiChevronDown className="text-xl" />
                    ) : (
                        <FiChevronRight className="text-xl" />
                    )}
                </button>

                <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-cem-neutral-gray-900 leading-tight">
                        {category.name}
                    </h3>
                    <p className="text-[14px] text-cem-neutral-gray-500 font-normal mt-1">
                        {category.description}
                    </p>
                    <p className="text-[13px] text-cem-neutral-gray-400 font-medium mt-2">
                        {category.courseCount ?? courseCount} {(category.courseCount ?? courseCount) === 1 ? "curso" : "cursos"}
                    </p>
                </div>
            </div>

            <div
                className="flex flex-row items-center gap-4 ml-10 md:ml-0"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!draggedCourse) {
                            onEdit(category);
                        }
                    }}
                    disabled={!!draggedCourse}
                    className="w-[32px] h-[31px] flex items-center justify-center text-cem-primary bg-cem-primary/10 rounded-lg hover:bg-cem-primary hover:text-white transition-all duration-300 disabled:opacity-50"
                    title="Editar categoría"
                >
                    <FiEdit3 className="text-lg" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!draggedCourse) {
                            onDelete(category);
                        }
                    }}
                    disabled={!!draggedCourse}
                    className="w-[32px] h-[31px] flex items-center justify-center text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                    title="Eliminar categoría"
                >
                    <FiTrash2 className="text-lg" />
                </button>
            </div>
        </div>
    );
};
