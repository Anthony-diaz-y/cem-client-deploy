import { getAllCoursesWithMeta } from "@shared/services/course/courseAPI";
import type { Course } from "../types";

export const getCourses = async (filters?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{
  courses: Course[];
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
}> => {
  const { courses, meta } = await getAllCoursesWithMeta(filters);
  return { courses: (courses || []) as Course[], meta };
};
