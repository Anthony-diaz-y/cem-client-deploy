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
    <div className="flex min-w-[250px] flex-col rounded-xl bg-cem-cardbackground p-8 border border-cem-neutral-gray-100 shadow-sm">
      <p className="text-xl font-bold text-cem-neutral-gray-900">{INSTRUCTOR_TEXTS.stats.title}</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-cem-neutral-gray-500">{INSTRUCTOR_TEXTS.stats.totalCourses}</p>
          <p className="text-3xl font-black text-cem-primary">
            {totalCourses}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-cem-neutral-gray-500">{INSTRUCTOR_TEXTS.stats.totalStudents}</p>
          <p className="text-3xl font-black text-cem-primary">
            {totalStudents}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-cem-neutral-gray-500">{INSTRUCTOR_TEXTS.stats.totalIncome}</p>
          <p className="text-3xl font-black text-cem-primary">
            {INSTRUCTOR_TEXTS.stats.currencyPrefix} {totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorStats;
