/**
 * Componente para mostrar un curso individual dentro de una categoría
 */

import React from "react";
import { FiMove } from "react-icons/fi";
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
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-move shadow-sm ${isDragging
          ? "opacity-50 border-cem-primary bg-cem-primary/5 scale-95"
          : "bg-white border-cem-neutral-gray-100 hover:border-cem-primary/30 hover:shadow-md hover:-translate-y-0.5"
        }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDragging ? "bg-cem-primary text-white" : "bg-cem-neutral-gray-50 text-cem-neutral-gray-400 group-hover:text-cem-primary"}`}>
        <FiMove size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-cem-neutral-gray-900 truncate">
          {course.courseName}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] font-bold text-cem-neutral-gray-500 uppercase tracking-widest truncate">
            {course.instructor.firstName} {course.instructor.lastName}
          </p>
          <span className="w-1 h-1 rounded-full bg-cem-neutral-gray-300"></span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${course.status === "Published" ? "text-caribbeangreen-400" : "text-yellow-400"}`}>
            {course.status === "Published" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>
    </div>
  );
}

