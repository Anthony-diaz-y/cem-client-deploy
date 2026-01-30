"use client";

import React, { useState, useEffect } from "react";
import { StarRating } from "@shared/components";
import {
  getReviews,
  type Review,
  type ReviewsResponse,
} from "../../services/reviewsAPI";

interface CourseReviewsProps {
  courseId: string;
}

/**
 * CourseReviews - Componente para mostrar la lista de reseñas de un curso
 */
const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<
    ReviewsResponse["pagination"] | null
  >(null);
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

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    return `${name}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-cem-neutral-gray-900 mb-6">
          Reseñas del Curso
        </h2>
        <div className="text-cem-neutral-gray-500">Cargando reseñas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-cem-neutral-gray-900 mb-6">
          Reseñas del Curso
        </h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 p-6 rounded-xl mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-cem-neutral-gray-900">
          Reseñas del Curso
        </h2>
        {pagination && pagination.total > 0 && (
          <span className="text-cem-neutral-gray-600 text-sm">
            {pagination.total} {pagination.total === 1 ? "reseña" : "reseñas"}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-cem-neutral-gray-600 text-lg">
            No hay reseñas para este curso aún.
          </p>
          <p className="text-cem-neutral-gray-500 text-sm mt-2">
            Sé el primero en dejar una reseña.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {reviews.map((review: Review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl border border-cem-neutral-gray-200 hover:border-cem-neutral-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cem-teal-100 text-cem-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {getInitials(review.user.name)}
                    </div>
                    <div>
                      <strong className="text-cem-neutral-gray-900 block text-lg">
                        {review.user.name}
                      </strong>
                      <span className="text-cem-neutral-gray-500 text-sm">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StarRating
                      rating={review.rating}
                      readonly={true}
                      starSize={22}
                    />
                  </div>
                </div>
                <div className="text-cem-neutral-gray-600 mt-4 leading-relaxed">
                  <p className="whitespace-pre-wrap text-base">
                    {review.review}
                  </p>
                </div>
                {review.updatedAt !== review.createdAt && (
                  <p className="text-cem-neutral-gray-500 text-xs mt-3 italic">
                    Editado el {formatReviewDate(review.updatedAt)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-cem-neutral-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-white text-cem-neutral-gray-700 rounded-lg border border-cem-neutral-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cem-neutral-gray-50 hover:border-cem-primary transition-all font-medium"
                >
                  Anterior
                </button>
                <div className="px-4 py-2 bg-white rounded-lg border border-cem-neutral-gray-200">
                  <span className="text-cem-neutral-gray-600 text-sm">
                    Página{" "}
                    <span className="font-semibold text-cem-neutral-gray-900">
                      {pagination.page}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-cem-neutral-gray-900">
                      {pagination.totalPages}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-5 py-2.5 bg-white text-cem-neutral-gray-700 rounded-lg border border-cem-neutral-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cem-neutral-gray-50 hover:border-cem-primary transition-all font-medium"
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
