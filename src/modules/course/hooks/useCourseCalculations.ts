import { useMemo } from "react";
import GetAvgRating from "@shared/utils/avgRating";
import { CourseDetailsResponse } from "../types";

/** Hook que calcula estadísticas del curso: rating promedio y total de lecciones */
export const useCourseCalculations = (
  response: CourseDetailsResponse | null,
) => {
  /** Calcula el rating promedio del curso basado en las reseñas */
  const avgReviewCount = useMemo(() => {
    if (!response?.data?.courseDetails?.ratingAndReviews) return 0;
    return GetAvgRating(response.data.courseDetails.ratingAndReviews);
  }, [response?.data?.courseDetails?.ratingAndReviews]);

  /** Calcula el total de lecciones sumando todas las subsecciones */
  const totalNoOfLectures = useMemo(() => {
    if (!response?.data?.courseDetails?.courseContent) return 0;

    const courseContent = response.data.courseDetails.courseContent;
    if (!Array.isArray(courseContent)) return 0;

    let lectures = 0;
    courseContent.forEach((sec) => {
      // Manejar tanto subSection como subSections (compatibilidad con backend)
      let subSectionsArray: any[] = [];

      if (sec?.subSection && Array.isArray(sec.subSection)) {
        subSectionsArray = sec.subSection;
      } else if (
        (sec as any)?.subSections &&
        Array.isArray((sec as any).subSections)
      ) {
        subSectionsArray = (sec as any).subSections;
      }

      lectures += subSectionsArray.length;
    });

    return lectures;
  }, [response?.data?.courseDetails?.courseContent]);

  return { avgReviewCount, totalNoOfLectures };
};
