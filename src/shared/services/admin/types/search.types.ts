import type { Student } from "./student.types";
import type { Instructor } from "./instructor.types";
import type { AdminCourse } from "./course.types";

export interface GlobalSearchResult {
  students: Student[];
  instructors: Instructor[];
  courses: AdminCourse[];
}

export interface GlobalSearchResponse {
  success: boolean;
  message: string;
  data: GlobalSearchResult;
  counts: {
    students: number;
    instructors: number;
    courses: number;
    total: number;
  };
}
