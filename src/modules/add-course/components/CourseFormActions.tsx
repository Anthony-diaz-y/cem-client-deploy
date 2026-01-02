"use client";

import React from "react";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "@shared/components/IconBtn";
import { CourseFormActionsProps } from "../types";

/**
 * CourseFormActions - Actions component for course information form
 */
const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  loading,
}) => {
  return (
    <div className="flex justify-end gap-x-2">
      <IconBtn disabled={loading} text="Siguiente">
        <MdNavigateNext />
      </IconBtn>
    </div>
  );
};

export default CourseFormActions;
