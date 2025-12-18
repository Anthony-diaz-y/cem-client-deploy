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
    
    // Log para depuración
    if (process.env.NODE_ENV === 'development') {
      console.log('useCourseCalculations - CourseContent:', courseContent);
      courseContent.forEach((sec, index) => {
        console.log(`Section ${index}:`, {
          sectionName: sec?.sectionName,
          subSection: sec?.subSection,
          subSections: (sec as any)?.subSections,
          subSectionLength: sec?.subSection?.length,
          subSectionsLength: (sec as any)?.subSections?.length,
        });
      });
    }
    
    let lectures = 0;
    courseContent.forEach((sec) => {
      // Manejar tanto subSection como subSections (del backend)
      let subSectionsArray: any[] = [];
      
      if (sec?.subSection && Array.isArray(sec.subSection)) {
        subSectionsArray = sec.subSection;
      } else if ((sec as any)?.subSections && Array.isArray((sec as any).subSections)) {
        subSectionsArray = (sec as any).subSections;
      }
      
      lectures += subSectionsArray.length;
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Total lectures calculated:', lectures);
    }
    
    return lectures;
  }, [response?.data?.courseDetails?.courseContent]);

  return { avgReviewCount, totalNoOfLectures };
};
