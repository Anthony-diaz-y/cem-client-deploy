"use client";

import React from "react";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "@shared/components/IconBtn";

interface CourseBuilderNavigationProps {
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

/**
 * CourseBuilderNavigation - Navigation component for course builder
 */
const CourseBuilderNavigation: React.FC<CourseBuilderNavigationProps> = ({
  loading,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex justify-end gap-x-3">
      <button
        onClick={onBack}
        className="rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
      >
        Back
      </button>
      <IconBtn disabled={loading} text="Next" onclick={onNext}>
        <MdNavigateNext />
      </IconBtn>
    </div>
  );
};

export default CourseBuilderNavigation;
