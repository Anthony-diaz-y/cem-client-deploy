"use client";

import React from "react";
import { InstructorStatsProps } from "../types";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

/**
 * InstructorStats - Statistics component for instructor dashboard
 * Displays total courses, students, and income
 */
const InstructorStats: React.FC<InstructorStatsProps> = ({
  totalCourses,
  totalStudents,
  totalAmount,
}) => {
  return (
    <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">{INSTRUCTOR_TEXTS.stats.title}</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-lg text-richblack-200">{INSTRUCTOR_TEXTS.stats.totalCourses}</p>
          <p className="text-3xl font-semibold text-richblack-50">
            {totalCourses}
          </p>
        </div>
        <div>
          <p className="text-lg text-richblack-200">{INSTRUCTOR_TEXTS.stats.totalStudents}</p>
          <p className="text-3xl font-semibold text-richblack-50">
            {totalStudents}
          </p>
        </div>
        <div>
          <p className="text-lg text-richblack-200">{INSTRUCTOR_TEXTS.stats.totalIncome}</p>
          <p className="text-3xl font-semibold text-richblack-50">
            {INSTRUCTOR_TEXTS.stats.currencyPrefix} {totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorStats;
