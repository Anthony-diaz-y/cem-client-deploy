import { useMemo } from "react";
import { InstructorDataType, Course } from "../types";

/**
 * Custom hook for instructor statistics calculations
 * Separates calculation logic from component
 */
export const useInstructorStats = (
  instructorData: InstructorDataType[] | null,
  courses: Course[]
) => {
  const totalAmount = useMemo(() => {
    return (
      instructorData?.reduce(
        (acc, curr) => acc + curr.totalAmountGenerated,
        0
      ) || 0
    );
  }, [instructorData]);

  const totalStudents = useMemo(() => {
    return (
      instructorData?.reduce(
        (acc, curr) => acc + curr.totalStudentsEnrolled,
        0
      ) || 0
    );
  }, [instructorData]);

  const totalCourses = useMemo(() => {
    return courses.length;
  }, [courses]);

  return { totalAmount, totalStudents, totalCourses };
};
