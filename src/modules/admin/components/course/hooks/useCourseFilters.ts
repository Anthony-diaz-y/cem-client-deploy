import { useMemo } from "react";
import { AdminCourse } from "@shared/services/adminAPI";

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

/**
 * Hook personalizado para filtrar cursos según múltiples criterios
 * Retorna los cursos filtrados y las listas de categorías e instructores únicos
 */
export function useCourseFilters(
  courses: AdminCourse[],
  statusFilter: "all" | "Draft" | "Published",
  categoryFilter: string,
  instructorFilter: string,
  searchQuery: string,
  allCategories: Category[]
) {
  // Obtiene categorías únicas de los cursos
  const categoriesFromCourses = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(
        courses.map((course) => [course.category.id, course.category])
      ).values()
    );
    return uniqueCategories;
  }, [courses]);

  // Usa todas las categorías de la API, o las de los cursos si no hay categorías de API
  const categories =
    allCategories.length > 0 ? allCategories : categoriesFromCourses;

  // Obtiene instructores únicos
  const instructors = useMemo(() => {
    const uniqueInstructors = Array.from(
      new Map(
        courses.map((course) => [course.instructor.id, course.instructor])
      ).values()
    );
    return uniqueInstructors;
  }, [courses]);

  // Filtra los cursos según los criterios seleccionados
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Filtro por estado
      if (statusFilter !== "all" && course.status !== statusFilter) {
        return false;
      }

      // Filtro por categoría
      if (categoryFilter !== "all" && course.category.id !== categoryFilter) {
        return false;
      }

      // Filtro por instructor
      if (
        instructorFilter !== "all" &&
        course.instructor.id !== instructorFilter
      ) {
        return false;
      }

      // Filtro por búsqueda
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

