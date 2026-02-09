"use client";

import { useSelector } from "react-redux";
import InstructorChart from "../components/InstructorChart";
import InstructorStats from "../components/InstructorStats";
import InstructorCoursesGrid from "../components/InstructorCoursesGrid";
import InstructorLoadingSkeleton from "../components/InstructorLoadingSkeleton";
import InstructorEmptyState from "../components/InstructorEmptyState";
import { useInstructorData } from "../hooks/useInstructorData";
import { useInstructorStats } from "../hooks/useInstructorStats";
import { useSkeletonLoading } from "../hooks/useSkeletonLoading";
import { RootState } from "@shared/store/store";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

/**
 * Instructor - Main component for instructor dashboard
 * Minimal logic container following Scream Modular Architecture
 */
export default function Instructor() {
  const { user } = useSelector((state: RootState) => state.profile);
  const { loading, instructorData, courses } = useInstructorData();
  const { totalAmount, totalStudents, totalCourses } = useInstructorStats(
    instructorData,
    courses
  );

  const showSkeleton = useSkeletonLoading({
    loading,
    hasData: courses.length > 0 || instructorData !== null,
  });

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          {INSTRUCTOR_TEXTS.dashboard.greeting.hi} {user?.firstName} {INSTRUCTOR_TEXTS.dashboard.greeting.emoji}
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          {INSTRUCTOR_TEXTS.dashboard.greeting.subtitle}
        </p>
      </div>

      {showSkeleton ? (
        <InstructorLoadingSkeleton />
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {courses.length > 0 ? (
              <InstructorChart courses={courses} />
            ) : (
              <div className="flex-1 rounded-md bg-cem-primary p-6">
                <p className="text-lg font-bold text-richblack-5">{INSTRUCTOR_TEXTS.dashboard.chart.title}</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  {INSTRUCTOR_TEXTS.dashboard.chart.noData}
                </p>
              </div>
            )}

            <InstructorStats
              totalCourses={totalCourses}
              totalStudents={totalStudents}
              totalAmount={totalAmount}
            />
          </div>

          <InstructorCoursesGrid courses={courses} />
        </div>
      ) : (
        <InstructorEmptyState />
      )}
    </div>
  );
}
