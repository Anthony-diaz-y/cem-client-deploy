"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { getUserReview, type Review } from "../services/reviewsAPI";
import type { Course } from "../types";

/** Hook que maneja las reseñas del curso: obtiene reseña del usuario y verifica permisos */
export const useCourseReviews = (
  courseId: string | string[] | undefined,
  course: Course | undefined,
) => {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT;
  const isEnrolled = user && course?.studentsEnrolled?.includes(user._id || "");

  /** Obtiene la reseña del usuario si está inscrito y es estudiante */
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!token || !courseId || !isStudent || !isEnrolled) {
        setLoading(false);
        return;
      }

      try {
        const normalizedCourseId = Array.isArray(courseId)
          ? courseId[0]
          : courseId;
        const review = await getUserReview(normalizedCourseId, token);
        if (review) {
          setUserReview(review);
        }
      } catch (error) {
        // Error silencioso - el usuario simplemente no tiene reseña
      } finally {
        setLoading(false);
      }
    };

    fetchUserReview();
  }, [token, courseId, isStudent, isEnrolled]);

  /** Actualiza la reseña del usuario después de crearla o editarla */
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
