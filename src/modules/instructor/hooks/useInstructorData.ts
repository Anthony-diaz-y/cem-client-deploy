import { useEffect, useState } from "react";
import { InstructorDataType, Course } from "../types";
import { getInstructorData } from "@shared/services/profileAPI";
import { fetchInstructorCourses } from "@shared/services/courseDetailsAPI";

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
      try {
        // Obtener token del localStorage
        let token: string | null = null;
        if (typeof window !== 'undefined') {
          const tokenStr = localStorage.getItem('token');
          if (tokenStr) {
            try {
              token = JSON.parse(tokenStr);
            } catch {
              token = tokenStr;
            }
          }
        }

        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        // Obtener datos del instructor y cursos
        const [instructorApiData, instructorCourses] = await Promise.all([
          getInstructorData(token),
          fetchInstructorCourses(token),
        ]);

        if (instructorApiData && Array.isArray(instructorApiData) && instructorApiData.length > 0) {
          setInstructorData(instructorApiData as InstructorDataType[]);
        }

        if (instructorCourses && Array.isArray(instructorCourses)) {
          setCourses(instructorCourses as Course[]);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
      setLoading(false);
    })();
  }, []);

  return { loading, instructorData, courses };
};
