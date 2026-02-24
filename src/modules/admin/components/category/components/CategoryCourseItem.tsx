/**
 * Componente para mostrar un curso individual dentro de una categoría
 */

import React from "react";
import type { CourseItem } from "../types";

interface CategoryCourseItemProps {
  course: CourseItem;
  categoryId: string;
}

export default function CategoryCourseItem({
  course,
}: CategoryCourseItemProps) {
  return (
    <div
      className="group flex items-center gap-4 p-5 rounded-2xl border transition-all bg-white border-cem-neutral-gray-100 hover:border-cem-primary hover:shadow-md cursor-default"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-[17px] font-bold text-cem-neutral-gray-900 truncate mb-0.5">
          {course.courseName}
        </h4>
        <div className="flex items-center gap-2 text-[14px] text-cem-neutral-gray-500 font-medium">
          <span>
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
          <span className="w-1 h-1 rounded-full bg-cem-neutral-gray-300" />
          <span
            className={
              course.status === "Published"
                ? "text-cem-neutral-gray-500"
                : "text-yellow-600"
            }
          >
            {course.status === "Published" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>
    </div>
  );
}
