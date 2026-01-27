import { useMemo } from "react";
import type { Course } from "../../catalog/types";

const MAX_COURSES = 6;

/**
 * Hook para obtener los primeros 6 cursos de la lista
 */
export function useCombinedCourses(courses: Course[]) {
  return useMemo(() => {
    return courses.slice(0, MAX_COURSES);
  }, [courses]);
}

