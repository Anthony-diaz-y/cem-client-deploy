import { fetchCourseCategories, getAllCoursesWithMeta } from "@shared/services/course/courseAPI";
import type { CourseCategory } from "@shared/services/course/types";
import type { Course } from "../types";

export const getCategories = async (): Promise<CourseCategory[]> => {
  return await fetchCourseCategories();
};

export const getCourses = async (filters?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ courses: Course[]; meta?: { page?: number; limit?: number; total?: number; totalPages?: number } }> => {
  const { courses, meta } = await getAllCoursesWithMeta(filters);
  return { courses: (courses || []) as Course[], meta };
};

