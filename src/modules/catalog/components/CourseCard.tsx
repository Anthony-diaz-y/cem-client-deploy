import React, { useMemo } from "react";
// Icons
// import { FaRegStar, FaStar } from "react-icons/fa"
// import ReactStars from "react-rating-stars-component"
import Link from "next/link";

import GetAvgRating from "@shared/utils/avgRating";
import { RatingStars } from "@shared/components";
import { Img } from "@shared/components";
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
        <div className="bg-richblack-800 rounded-2xl overflow-hidden border border-richblack-700 hover:border-yellow-50/50 transition-all duration-300 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 w-full transform hover:-translate-y-1">
          {/* Image Container - Fixed Height con mejor diseño */}
          <div className={`${Height} w-full overflow-hidden flex-shrink-0 relative bg-richblack-900`}>
            {course?.thumbnail ? (
              <Img
                src={course.thumbnail}
                alt={course?.courseName || "course thumbnail"}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-richblack-800 via-richblack-700 to-richblack-900 flex flex-col items-center justify-center">
                <svg className="w-20 h-20 text-richblack-500 opacity-50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-richblack-400 text-xs font-medium">Sin imagen</span>
              </div>
            )}
            {/* Overlay gradient mejorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/80 via-richblack-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10"></div>
            
            {/* Badge de precio en la imagen (opcional, más llamativo) */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-yellow-50/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                <p className="text-richblack-900 font-bold text-sm">
                  Rs. {course?.price}
                </p>
              </div>
            </div>
          </div>
          
          {/* Content Container - Mejorado con más espacio y estructura */}
          <div className="flex flex-col flex-grow p-5 min-h-[220px] justify-between">
            <div className="flex flex-col gap-3.5 flex-grow">
              {/* Course Title - Mejorado */}
              <h3 className="text-xl font-bold text-richblack-5 line-clamp-2 leading-snug group-hover:text-yellow-50 transition-colors duration-200 min-h-[3.5rem]">
                {course?.courseName}
              </h3>
              
              {/* Instructor - Mejorado */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-richblack-300 text-xs font-semibold">
                    {course?.instructor?.firstName?.[0] || "I"}
                    {course?.instructor?.lastName?.[0] || ""}
                  </span>
                </div>
                <p className="text-sm text-richblack-300 font-medium truncate">
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
              </div>
              
              {/* Rating Section - Mejorado */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 bg-richblack-700/50 px-3 py-1.5 rounded-lg">
                  <span className="text-yellow-50 font-bold text-base">
                    {avgReviewCount > 0 ? avgReviewCount.toFixed(1) : "0.0"}
                  </span>
                  <RatingStars Review_Count={avgReviewCount} />
                </div>
                <span className="text-richblack-400 text-xs font-medium">
                  ({(course as any)?.totalReviews ?? (course?.ratingAndReviews?.length || 0)} reseñas)
                </span>
              </div>
              
              {/* Estudiantes inscritos (si está disponible) */}
              {(course as any)?.totalStudentsEnrolled !== undefined && (
                <div className="flex items-center gap-1.5 text-richblack-400 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span className="font-medium">
                    {(course as any).totalStudentsEnrolled} estudiantes
                  </span>
                </div>
              )}
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
