"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { getUserReview, type Review } from "../services/reviewsAPI";
import type { Course } from "../types";

/**
 * Hook personalizado para manejar las reseñas del curso
 */
export const useCourseReviews = (courseId: string | string[] | undefined, course: Course | undefined) => {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario es estudiante
  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT;

  // Verificar si el usuario está inscrito en el curso
  const isEnrolled = user && course?.studentsEnrolled?.includes(user._id || "");

  // Obtener reseña del usuario si existe
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!token || !courseId || !isStudent || !isEnrolled) {
        setLoading(false);
        return;
      }

      try {
        const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
        const review = await getUserReview(normalizedCourseId, token);
        if (review) {
          setUserReview(review);
        }
      } catch (error) {
        console.error("Error al obtener reseña del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReview();
  }, [token, courseId, isStudent, isEnrolled]);

  const handleReviewSuccess = (review: Review) => {
    setUserReview(review);
  };

  return {
    userReview,
    isStudent,
    isEnrolled,
    canReview: isStudent && isEnrolled && !!token,
    loading,
    handleReviewSuccess,
  };
};

