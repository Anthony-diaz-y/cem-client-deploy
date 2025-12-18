import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseDetailsResponse } from "../types";
import { fetchCourseDetails } from "@shared/services/courseDetailsAPI";

/**
 * Custom hook to fetch and manage course details
 * Separates data fetching logic from component
 */
export const useCourseDetails = () => {
  const { courseId } = useParams();
  const [response, setResponse] = useState<CourseDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para validar UUID
  const isValidUUID = (id: string | string[] | undefined): boolean => {
    if (!id || typeof id !== 'string') {
      return false;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    const fetchCourseDetailsData = async () => {
      try {
        setLoading(true);
        
        // Normalize courseId to string (handle array case)
        const normalizedCourseId = Array.isArray(courseId)
          ? courseId[0]
          : courseId;

        // Validar que courseId existe y es un UUID válido
        if (!normalizedCourseId || typeof normalizedCourseId !== 'string') {
          console.error("Course ID is required and must be a valid UUID string");
          setLoading(false);
          return;
        }

        // Validar formato UUID antes de hacer la petición
        if (!isValidUUID(normalizedCourseId)) {
          console.error(
            "Invalid course ID format (expected UUID):",
            normalizedCourseId,
            "\nThe course ID must be a valid UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
          );
          setLoading(false);
          return;
        }

        // Fetch course details from backend
        const res = await fetchCourseDetails(normalizedCourseId);
        if (res) {
          setResponse(res as CourseDetailsResponse);
        }
      } catch (error) {
        console.error("Could not fetch Course Details", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo ejecutar si courseId existe
    if (courseId) {
      fetchCourseDetailsData();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  return { response, loading };
};
