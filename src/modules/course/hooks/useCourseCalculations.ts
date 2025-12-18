import { useMemo } from "react";
import GetAvgRating from "@shared/utils/avgRating";
import { CourseDetailsResponse } from "../types";

/**
 * Custom hook for course-related calculations
 * Separates calculation logic from component
 */
export const useCourseCalculations = (
  response: CourseDetailsResponse | null
) => {
  // Calculate average rating using useMemo
  const avgReviewCount = useMemo(() => {
    if (!response?.data?.courseDetails?.ratingAndReviews) return 0;
    return GetAvgRating(response.data.courseDetails.ratingAndReviews);
  }, [response?.data?.courseDetails?.ratingAndReviews]);

  // Calculate total lectures using useMemo
  const totalNoOfLectures = useMemo(() => {
    if (!response?.data?.courseDetails?.courseContent) return 0;
    
    // Verificar que courseContent es un array
    const courseContent = response.data.courseDetails.courseContent;
    if (!Array.isArray(courseContent)) return 0;
    
    let lectures = 0;
    courseContent.forEach((sec) => {
      // Verificar que subSection existe y es un array antes de acceder a length
      if (sec?.subSection && Array.isArray(sec.subSection)) {
        lectures += sec.subSection.length;
      }
    });
    return lectures;
  }, [response?.data?.courseDetails?.courseContent]);

  return { avgReviewCount, totalNoOfLectures };
};
