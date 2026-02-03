import { useMemo } from "react";
import { AdminCourse } from "@shared/services/adminAPI";

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export function useCourseFilters(
  courses: AdminCourse[],
  statusFilter: "all" | "Draft" | "Published",
  categoryFilter: string,
  instructorFilter: string,
  searchQuery: string,
  allCategories: Category[],
) {
  const categoriesFromCourses = useMemo(() => {
    const allCats = courses
      .flatMap((course) =>
        Array.isArray(course.category) ? course.category : [course.category],
      )
      .filter(Boolean);

    const uniqueCategories = Array.from(
      new Map(allCats.map((cat: any) => [cat.id || cat._id, cat])).values(),
    );
    return uniqueCategories as Category[];
  }, [courses]);

  const categories =
    allCategories.length > 0 ? allCategories : categoriesFromCourses;

  const instructors = useMemo(() => {
    const uniqueInstructors = Array.from(
      new Map(
        courses.map((course) => [course.instructor.id, course.instructor]),
      ).values(),
    );
    return uniqueInstructors;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (statusFilter !== "all" && course.status !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "all") {
        const courseCats = Array.isArray(course.category)
          ? course.category
          : [course.category];

        const hasCategory = courseCats.some(
          (cat: any) => cat.id === categoryFilter || cat._id === categoryFilter,
        );

        if (!hasCategory) return false;
      }

      if (
        instructorFilter !== "all" &&
        course.instructor.id !== instructorFilter
      ) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          course.courseName.toLowerCase().includes(query) ||
          course.courseDescription.toLowerCase().includes(query) ||
          `${course.instructor.firstName} ${course.instructor.lastName}`
            .toLowerCase()
            .includes(query)
        );
      }

      return true;
    });
  }, [courses, statusFilter, categoryFilter, instructorFilter, searchQuery]);

  return {
    filteredCourses,
    categories,
    instructors,
  };
}
