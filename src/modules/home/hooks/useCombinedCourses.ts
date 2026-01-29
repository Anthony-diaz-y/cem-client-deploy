import { useMemo } from "react";
import type { Course } from "../../courses/types";

const MAX_COURSES = 6;

/**
 * Hook para obtener los primeros 6 cursos de la lista
 */
export function useCombinedCourses(courses: Course[]) {
  return useMemo(() => {
    if (!Array.isArray(courses) || courses.length === 0) return [];
    return courses.slice(0, MAX_COURSES) || [];
  }, [courses]);
}

