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
      className="w-[290px] h-[40px] px-4 flex items-center justify-between hover:bg-cem-neutral-gray-50 transition-all text-left group bg-white border border-cem-neutral-gray-200 rounded-[10px] mb-3 transition-colors"
    >
      <span className="text-[14px] text-cem-neutral-gray-700 font-medium group-hover:text-cem-neutral-gray-900 transition-colors truncate pr-2">
        {course.courseName}
      </span>
      <div className="w-6 h-6 rounded-full border border-cem-neutral-gray-300 flex items-center justify-center text-cem-neutral-gray-500 group-hover:border-cem-primary group-hover:text-cem-primary transition-all flex-shrink-0">
        <BiChevronRight className="text-lg" />
      </div>
    </button>
  );
};

export default CourseListItem;
