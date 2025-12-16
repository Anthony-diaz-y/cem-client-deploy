"use client";

import { useSelector } from "react-redux";
import InstructorChart from "../components/InstructorChart";
import InstructorStats from "../components/InstructorStats";
import InstructorCoursesGrid from "../components/InstructorCoursesGrid";
import InstructorLoadingSkeleton from "../components/InstructorLoadingSkeleton";
import InstructorEmptyState from "../components/InstructorEmptyState";
import { useInstructorData } from "../hooks/useInstructorData";
import { useInstructorStats } from "../hooks/useInstructorStats";
import { RootState } from "@shared/store/store";

/**
 * Instructor - Main component for instructor dashboard
 * Orchestrates instructor data and statistics through custom hooks
 */
export default function Instructor() {
  const { user } = useSelector((state: RootState) => state.profile);
  const { loading, instructorData, courses } = useInstructorData();
  const { totalAmount, totalStudents, totalCourses } = useInstructorStats(
    instructorData,
    courses
  );

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let&apos;s start something new
        </p>
      </div>

      {loading ? (
        <InstructorLoadingSkeleton />
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData || []} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
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
