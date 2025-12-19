import React, { useMemo } from "react";
// Icons
// import { FaRegStar, FaStar } from "react-icons/fa"
// import ReactStars from "react-rating-stars-component"
import Link from "next/link";

import GetAvgRating from "@shared/utils/avgRating";
import RatingStars from "@shared/components/RatingStars";
import Img from "@shared/components/Img";
import { CourseCardProps } from "../types";

function CourseCard({ course, Height }: CourseCardProps) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const avgReviewCount = useMemo(() => {
    // Priorizar averageRating del backend si está disponible
    const courseAny = course as any;
    
    // Primero intentar usar averageRating del backend
    if (courseAny?.averageRating !== undefined && courseAny?.averageRating !== null && courseAny?.averageRating > 0) {
      return Math.max(0, Math.min(5, courseAny.averageRating));
    }
    
    // Si no hay averageRating, calcular desde ratingAndReviews
    // Intentar obtener reviews de diferentes posibles campos
    const reviews = course.ratingAndReviews || courseAny?.reviews || courseAny?.ratings || null;
    
    if (!reviews) {
      // Si no hay reviews, retornar 0 sin log (es normal para cursos sin reseñas)
      return 0;
    }
    
    // Verificar si es un array válido
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }
    
    // Verificar que las reseñas tengan el campo 'rating'
    const validReviews = reviews.filter((r: any) => {
      if (!r) return false;
      // Aceptar tanto 'rating' como 'ratingValue' u otros campos posibles
      const ratingValue = r.rating !== undefined ? r.rating : (r.ratingValue !== undefined ? r.ratingValue : null);
      return ratingValue !== null && ratingValue !== undefined && !isNaN(ratingValue);
    });
    
    if (validReviews.length === 0) {
      return 0;
    }
    
    // Normalizar las reseñas para GetAvgRating (necesita campo 'rating')
    const normalizedReviews = validReviews.map((r: any) => ({
      rating: r.rating !== undefined ? r.rating : (r.ratingValue || 0)
    }));
    
    // Calcular el promedio desde las reseñas válidas
    const rating = GetAvgRating(normalizedReviews);
    const finalRating = Math.max(0, Math.min(5, rating || 0));
    
    if (process.env.NODE_ENV === 'development' && finalRating > 0) {
      console.log('CourseCard - Calculated rating from reviews:', {
        courseName: course?.courseName,
        calculatedRating: finalRating,
        validReviewsCount: validReviews.length,
        totalReviewsCount: reviews.length
      });
    }
    
    return finalRating;
  }, [course]);
  
  // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
  const courseId = (course as any)?.id || course?._id;
  
  // Si no hay ID válido, no renderizar el link
  if (!courseId) {
    console.error("Course ID is missing for course:", course?.courseName);
    return null;
  }

  return (
    <div className="h-full flex w-full">
      <Link href={`/courses/${courseId}`} className="h-full w-full flex flex-col group">
        <div className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 hover:border-yellow-50/30 transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-xl w-full">
          {/* Image Container - Fixed Height - Aumentado para mejor visualización */}
          <div className={`${Height} w-full overflow-hidden flex-shrink-0 relative bg-richblack-900`}>
            <img
              src={course?.thumbnail || ''}
              alt={course?.courseName || "course thumbnail"}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={(e) => {
                // Fallback si la imagen no carga
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'absolute inset-0 bg-gradient-to-br from-richblack-800 to-richblack-900 flex items-center justify-center';
                placeholder.innerHTML = '<span class="text-richblack-500 text-sm">Sin imagen</span>';
                target.parentElement?.appendChild(placeholder);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10"></div>
          </div>
          
          {/* Content Container - Flexible but with min-height - Asegurar altura consistente */}
          <div className="flex flex-col flex-grow p-4 min-h-[200px] justify-between">
            <div className="flex flex-col gap-3">
              {/* Course Title */}
              <h3 className="text-lg font-semibold text-richblack-5 line-clamp-2 leading-tight group-hover:text-yellow-50 transition-colors duration-200">
                {course?.courseName}
              </h3>
              
              {/* Instructor */}
              <p className="text-sm text-richblack-300">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
              
              {/* Rating Section */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-50 font-medium text-sm">
                    {avgReviewCount > 0 ? avgReviewCount.toFixed(1) : "0"}
                  </span>
                  <RatingStars Review_Count={avgReviewCount} />
                </div>
                <span className="text-richblack-400 text-xs">
                  ({(course as any)?.totalReviews ?? (course?.ratingAndReviews?.length || 0)})
                </span>
              </div>
            </div>
            
            {/* Price - Always at bottom */}
            <div className="mt-4 pt-4 border-t border-richblack-700">
              <p className="text-xl font-bold text-yellow-50">
                Rs. {course?.price}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseCard;
