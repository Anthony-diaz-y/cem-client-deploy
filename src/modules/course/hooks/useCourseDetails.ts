import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { CourseDetailsResponse } from "../types";
import { fetchCourseDetails } from "@shared/services/courseDetailsAPI";

/**
 * Custom hook to fetch and manage course details
 * Separates data fetching logic from component
 */
export const useCourseDetails = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state: RootState) => state.auth);
  const [response, setResponse] = useState<CourseDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Función para validar UUID
  const isValidUUID = (id: string | string[] | undefined): boolean => {
    if (!id || typeof id !== "string") {
      return false;
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Note: the regex in the original file had a small typo in the count or I should match exactly.
    // Original: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  const fetchCourseDetailsData = useCallback(async () => {
    let skeletonTimer: NodeJS.Timeout | undefined;

    try {
      setLoading(true);
      setShowSkeleton(false);

      // Solo mostrar skeleton si la carga toma más de 300ms
      skeletonTimer = setTimeout(() => {
        setShowSkeleton(true);
      }, 300);

      const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;

      if (!normalizedCourseId || typeof normalizedCourseId !== "string" || !isValidUUID(normalizedCourseId)) {
        if (skeletonTimer) clearTimeout(skeletonTimer);
        setLoading(false);
        return;
      }

      // Fetch course details from backend, passing token if available
      const res = await fetchCourseDetails(normalizedCourseId, token || undefined);
      if (res) {
        setResponse(res as CourseDetailsResponse);
      }
    } catch (error) {
      console.error("Could not fetch Course Details", error);
    } finally {
      if (skeletonTimer) clearTimeout(skeletonTimer);
      setLoading(false);
      setShowSkeleton(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetailsData();
    } else {
      setLoading(false);
    }
  }, [courseId, fetchCourseDetailsData]);

  return { response, loading, showSkeleton, refresh: fetchCourseDetailsData };
};
