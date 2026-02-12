/**
 * Componente para mostrar un curso individual dentro de una categoría
 */

import React from "react";
import type { CourseItem } from "../types";

interface CategoryCourseItemProps {
  course: CourseItem;
  categoryId: string;
  draggedCourse: {
    courseId: string;
    sourceCategoryId: string;
    courseName: string;
  } | null;
  onDragStart: (e: React.DragEvent, courseId: string, sourceCategoryId: string, courseName: string) => void;
  onDragEnd: () => void;
}

export default function CategoryCourseItem({
  course,
  categoryId,
  draggedCourse,
  onDragStart,
  onDragEnd,
}: CategoryCourseItemProps) {
  const isDragging = draggedCourse?.courseId === course.id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, course.id, categoryId, course.courseName)}
      onDragEnd={onDragEnd}
      className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-move ${isDragging
        ? "opacity-50 border-cem-primary bg-cem-primary/5 scale-95"
        : "bg-white border-cem-neutral-gray-200 hover:border-cem-primary hover:shadow-md"
        }`}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-[16px] font-bold text-cem-neutral-gray-900 truncate mb-1">
          {course.courseName}
        </h4>
        <p className="text-[13px] text-cem-neutral-gray-500 font-medium truncate">
          {course.instructor.firstName} {course.instructor.lastName} • <span className={course.status === "Published" ? "text-cem-neutral-gray-500" : "text-yellow-600"}>
            {course.status === "Published" ? "Publicado" : "Borrador"}
          </span>
        </p>
      </div>
    </div>
  );
}

