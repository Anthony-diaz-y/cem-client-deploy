import { useMemo } from "react"
import GetAvgRating from "../../../shared/utils/avgRating"
import { CourseDetailsResponse } from "../types"

/**
 * Custom hook for course-related calculations
 * Separates calculation logic from component
 */
export const useCourseCalculations = (response: CourseDetailsResponse | null) => {
  // Calculate average rating using useMemo
  const avgReviewCount = useMemo(() => {
    if (!response?.data?.courseDetails?.ratingAndReviews) return 0
    return GetAvgRating(response.data.courseDetails.ratingAndReviews)
  }, [response?.data?.courseDetails?.ratingAndReviews])

  // Calculate total lectures using useMemo
  const totalNoOfLectures = useMemo(() => {
    if (!response?.data?.courseDetails?.courseContent) return 0
    let lectures = 0
    response.data.courseDetails.courseContent.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    return lectures
  }, [response?.data?.courseDetails?.courseContent])

  return { avgReviewCount, totalNoOfLectures }
}

