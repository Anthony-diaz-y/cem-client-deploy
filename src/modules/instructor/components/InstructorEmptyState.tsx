"use client";

import React from "react";
import Link from "next/link";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

/**
 * InstructorEmptyState - Empty state component for instructor dashboard
 */
const InstructorEmptyState: React.FC = () => {
  return (
    <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
      <p className="text-center text-2xl font-bold text-richblack-5">
        {INSTRUCTOR_TEXTS.courses.emptyState.message}
      </p>

      <Link href={INSTRUCTOR_TEXTS.links.addCourse}>
        <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
          {INSTRUCTOR_TEXTS.courses.emptyState.action}
        </p>
      </Link>
    </div>
  );
};

export default InstructorEmptyState;
