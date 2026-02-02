"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CoursePreview } from "../types";
import { BiChevronRight } from "react-icons/bi";

interface CourseListItemProps {
  course: CoursePreview;
}

/** Individual course item displayed in the learning path dropdown */
const CourseListItem: React.FC<CourseListItemProps> = ({ course }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors text-left group bg-gray-50"
    >
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {course.courseName}
      </span>
      <BiChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 text-lg" />
    </button>
  );
};

export default CourseListItem;
