import { useEffect, useState } from "react";
import { InstructorDataType, Course } from "../types";

/**
 * Custom hook to fetch and manage instructor data
 * Separates data fetching logic from component
 */
export const useInstructorData = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState<
    InstructorDataType[] | null
  >(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // const instructorApiData = await getInstructorData(token)
      // const result = await fetchInstructorCourses(token)

      // --- MOCK DATA FOR DEMO PURPOSES ---
      const mockInstructorData: InstructorDataType[] = [
        {
          _id: "1",
          courseName: "Curso Profesional de React",
          courseDescription: "Domina React desde cero hasta experto",
          totalStudentsEnrolled: 120,
          totalAmountGenerated: 12000,
        },
        {
          _id: "2",
          courseName: "Backend con Node.js",
          courseDescription: "Construye APIs escalables",
          totalStudentsEnrolled: 85,
          totalAmountGenerated: 8500,
        },
        {
          _id: "3",
          courseName: "Diseño UX/UI Moderno",
          courseDescription: "Principios de diseño para desarrolladores",
          totalStudentsEnrolled: 200,
          totalAmountGenerated: 5000,
        },
      ];

      const mockCourses: Course[] = [
        {
          _id: "1",
          courseName: "Curso Profesional de React",
          courseDescription: "Domina React desde cero hasta experto",
          thumbnail:
            "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          studentsEnrolled: Array.from(
            { length: 120 },
            (_, i) => `student${i}`
          ),
          price: 100,
          status: "Published",
        },
        {
          _id: "2",
          courseName: "Backend con Node.js",
          courseDescription: "Construye APIs escalables",
          thumbnail:
            "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          studentsEnrolled: Array.from({ length: 85 }, (_, i) => `student${i}`),
          price: 100,
          status: "Published",
        },
        {
          _id: "3",
          courseName: "Diseño UX/UI Moderno",
          courseDescription: "Principios de diseño para desarrolladores",
          thumbnail:
            "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          studentsEnrolled: Array.from(
            { length: 200 },
            (_, i) => `student${i}`
          ),
          price: 25,
          status: "Draft",
        },
      ];
      // -----------------------------------

      if (mockInstructorData?.length) setInstructorData(mockInstructorData);
      if (mockCourses) {
        setCourses(mockCourses);
      }
      setLoading(false);
    })();
  }, []);

  return { loading, instructorData, courses };
};
