"use client";

import React, { useState, useEffect } from "react";
import StarRating from "@shared/components/StarRating";
import { getReviews, type Review, type ReviewsResponse } from "../services/reviewsAPI";
import { formatDate } from "@shared/utils/formatDate";

interface CourseReviewsProps {
  courseId: string;
}

/**
 * CourseReviews - Componente para mostrar la lista de reseñas de un curso
 */
const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<ReviewsResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (pageNumber: number = 1, limit: number = 5) => {
    try {
      setLoading(true);
      const result = await getReviews(courseId, pageNumber, limit);

      if (result) {
        setReviews(result.reviews);
        setPagination(result.pagination);
        setError(null);
      } else {
        setReviews([]);
        setPagination(null);
      }
    } catch (err) {
      setError("Error al cargar las reseñas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      // Mostrar solo 5 reseñas por página inicialmente
      fetchReviews(page, 5);
    }
  }, [courseId, page]);

  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-richblack-5 mb-6">Reseñas del Curso</h2>
        <div className="text-richblack-400">Cargando reseñas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-richblack-5 mb-6">Reseñas del Curso</h2>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-richblack-700 p-6 rounded-2xl mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-richblack-5">Reseñas del Curso</h2>
        {pagination && pagination.total > 0 && (
          <span className="text-richblack-400 text-sm">
            {pagination.total} {pagination.total === 1 ? "reseña" : "reseñas"}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-richblack-400 text-lg">
            No hay reseñas para este curso aún.
          </p>
          <p className="text-richblack-500 text-sm mt-2">
            Sé el primero en dejar una reseña.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-richblack-800 p-6 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-yellow-50 text-richblack-900 flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
                      {getInitials(review.user.firstName, review.user.lastName)}
                    </div>
                    <div>
                      <strong className="text-richblack-5 block text-lg">
                        {review.user.firstName} {review.user.lastName}
                      </strong>
                      <span className="text-richblack-400 text-sm">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StarRating rating={review.rating} readonly={true} starSize={22} />
                  </div>
                </div>
                <div className="text-richblack-200 mt-4 leading-relaxed">
                  <p className="whitespace-pre-wrap text-base">{review.review}</p>
                </div>
                {review.updatedAt !== review.createdAt && (
                  <p className="text-richblack-500 text-xs mt-3 italic">
                    Editado el {formatReviewDate(review.updatedAt)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Paginación mejorada */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-richblack-600">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-richblack-800 text-richblack-5 rounded-lg border border-richblack-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-richblack-600 hover:border-richblack-500 transition-all font-medium"
                >
                  Anterior
                </button>
                <div className="px-4 py-2 bg-richblack-800 rounded-lg border border-richblack-600">
                  <span className="text-richblack-200 text-sm">
                    Página <span className="font-semibold text-richblack-5">{pagination.page}</span> de{" "}
                    <span className="font-semibold text-richblack-5">{pagination.totalPages}</span>
                  </span>
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-5 py-2.5 bg-richblack-800 text-richblack-5 rounded-lg border border-richblack-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-richblack-600 hover:border-richblack-500 transition-all font-medium"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReviews;

