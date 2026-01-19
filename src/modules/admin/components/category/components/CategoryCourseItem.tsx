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
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
        isDragging
          ? "opacity-50 border-blue-500 bg-blue-500/10"
          : "bg-richblack-800/50 border-richblack-600 hover:border-richblack-500 hover:bg-richblack-800"
      }`}
    >
      <div className="text-richblack-400">
        <FiMove className="text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-richblack-5 truncate">
          {course.courseName}
        </p>
        <p className="text-xs text-richblack-400 mt-1">
          {course.instructor.firstName} {course.instructor.lastName} •{" "}
          {course.status === "Published" ? "Publicado" : "Borrador"}
        </p>
      </div>
    </div>
  );
}

