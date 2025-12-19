"use client";

import React, { useState, useEffect } from "react";
import StarRating from "@shared/components/StarRating";
import { getRatingStats, type RatingStats as RatingStatsType } from "../services/reviewsAPI";

interface RatingStatsProps {
  courseId: string;
}

/**
 * RatingStats - Componente para mostrar estadísticas de calificación
 */
const RatingStats: React.FC<RatingStatsProps> = ({ courseId }) => {
  const [stats, setStats] = useState<RatingStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getRatingStats(courseId);
        if (result) {
          setStats(result);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStats();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl">
        <div className="text-richblack-400">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl">
        <p className="text-richblack-400">No hay calificaciones aún</p>
      </div>
    );
  }

  const getPercentage = (count: number): number => {
    return Math.round((count / stats.totalReviews) * 100);
  };

  return (
    <div className="bg-richblack-700 p-6 rounded-2xl">
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-yellow-50 mb-2">
          {stats.averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-3">
          <StarRating
            rating={Math.round(stats.averageRating)}
            readonly={true}
            starSize={28}
          />
        </div>
        <div className="text-richblack-200">
          Basado en {stats.totalReviews}{" "}
          {stats.totalReviews === 1 ? "reseña" : "reseñas"}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-richblack-5 mb-4">
          Distribución de calificaciones
        </h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingDistribution[star.toString() as keyof typeof stats.ratingDistribution];
            const percentage = getPercentage(count);
            return (
              <div key={star} className="flex items-center gap-4">
                <span className="text-richblack-200 w-12 text-sm">{star} ⭐</span>
                <div className="flex-1 h-6 bg-richblack-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-50 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-richblack-200 text-sm w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingStats;

