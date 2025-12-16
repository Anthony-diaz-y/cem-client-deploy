"use client";

import React from "react";
import Link from "next/link";

/**
 * InstructorEmptyState - Empty state component for instructor dashboard
 */
const InstructorEmptyState: React.FC = () => {
  return (
    <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
      <p className="text-center text-2xl font-bold text-richblack-5">
        You have not created any courses yet
      </p>

      <Link href="/dashboard/add-course">
        <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
          Create a course
        </p>
      </Link>
    </div>
  );
};

export default InstructorEmptyState;
