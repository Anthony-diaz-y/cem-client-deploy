import React from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import type { CategoryCardProps } from "../interfaces/CategoryCard.interface";

interface CategoryCardHeaderProps extends Pick<
  CategoryCardProps,
  "category" | "draggedCourse" | "onToggle" | "onEdit" | "onDelete"
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
  // Determine category type (fallback for demo if not set)
  const categoryType =
    category.type ||
    (category.name.toLowerCase().includes("carrera") ? "career" : "sector");

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
          className="w-10 h-10 flex items-center justify-center transition-all bg-cem-neutral-gray-50 hover:bg-cem-neutral-gray-100 rounded-xl text-cem-neutral-gray-400 hover:text-cem-primary"
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
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-cem-neutral-gray-900 leading-tight">
              {category.name}
            </h3>
            {categoryType === "career" ? (
              <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] text-[12px] font-bold rounded-full">
                Carrera
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#E0E7FF] text-[#3730A3] text-[12px] font-bold rounded-full">
                Sector
              </span>
            )}
          </div>
          <p className="text-[14px] text-cem-neutral-gray-500 font-normal mt-1 min-h-[1.25rem]">
            {category.description}
          </p>
          <p className="text-[13px] text-cem-neutral-gray-400 font-medium mt-2">
            {category.courseCount ?? courseCount}{" "}
            {(category.courseCount ?? courseCount) === 1 ? "curso" : "cursos"}
          </p>
        </div>
      </div>

      <div
        className="flex flex-row items-center gap-4 ml-14 md:ml-0"
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
          className="w-[36px] h-[36px] flex items-center justify-center text-cem-primary bg-[#DCEEEF] rounded-lg hover:bg-cem-primary hover:text-white transition-all duration-300 disabled:opacity-50"
          title="Editar categoría"
        >
          <FiEdit3 className="text-xl" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!draggedCourse) {
              onDelete(category);
            }
          }}
          disabled={!!draggedCourse}
          className="w-[36px] h-[36px] flex items-center justify-center text-[#EF4444] bg-[#FEE2E2] rounded-lg hover:bg-[#EF4444] hover:text-white transition-all duration-300 disabled:opacity-50"
          title="Eliminar categoría"
        >
          <FiTrash2 className="text-xl" />
        </button>
      </div>
    </div>
  );
};
