import { useState, useEffect } from "react";
import { getAllCourses } from "@shared/services/courseDetailsAPI";
import type { Course } from "../../courses/types";

export function useHomeCatalogData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(false);

      try {
        const allCourses = await getAllCourses();

        if (Array.isArray(allCourses) && allCourses.length > 0) {
          setCourses(allCourses as Course[]);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching courses for home:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}
