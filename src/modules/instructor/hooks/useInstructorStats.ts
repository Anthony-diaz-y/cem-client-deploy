import { useMemo } from "react";
import { InstructorDataType, Course } from "../types";

/**
 * Custom hook for instructor statistics calculations
 * Separates calculation logic from component
 * Usa courses en lugar de instructorData porque courses tiene los datos normalizados y actualizados
 */
export const useInstructorStats = (
  instructorData: InstructorDataType[] | null,
  courses: Course[]
) => {
  // Calcular totalAmount: usar totalAmountGenerated del backend si está disponible, sino calcular
  const totalAmount = useMemo(() => {
    return courses.reduce((acc: number, course: Course) => {
      // Priorizar totalAmountGenerated del backend (según recomendación del backend)
      if (typeof course.totalAmountGenerated === 'number' && course.totalAmountGenerated >= 0) {
        return acc + course.totalAmountGenerated;
      }
      
      // Fallback: calcular desde price * students
      const studentsCount = Array.isArray(course.studentsEnrolled)
        ? course.studentsEnrolled.length
        : (course.totalStudentsEnrolled || 0);
      const courseIncome = (course.price || 0) * studentsCount;
      return acc + courseIncome;
    }, 0);
  }, [courses]);

  // Calcular totalStudents desde courses
  const totalStudents = useMemo(() => {
    return courses.reduce((acc: number, course: Course) => {
      // Calcular estudiantes: usar array si está disponible, sino usar totalStudentsEnrolled
      const studentsCount = Array.isArray(course.studentsEnrolled)
        ? course.studentsEnrolled.length
        : (course.totalStudentsEnrolled || 0);
      return acc + studentsCount;
    }, 0);
  }, [courses]);

  const totalCourses = useMemo(() => {
    return courses.length;
  }, [courses]);

  return { totalAmount, totalStudents, totalCourses };
};
