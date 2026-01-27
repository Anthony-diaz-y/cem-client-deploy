import React, { useMemo } from "react";
import Link from "next/link";
import GetAvgRating from "@shared/utils/avgRating";
import { RatingStars } from "@shared/components";
import { Img } from "@shared/components";
import { CourseCardProps, Course } from "../types";
import { formatDurationForBadge } from "../../home/utils";

interface Review {
  rating?: number;
  ratingValue?: number;
  [key: string]: unknown;
}
interface ExtendedCourse extends Course {
  averageRating?: number;
  totalReviews?: number;
  totalStudentsEnrolled?: number;
  reviews?: Review[];
  ratings?: Review[];
}

function CourseCard({ course, Height }: CourseCardProps) {
  const extendedCourse = course as ExtendedCourse;

  // Rating Calculation
  const avgReviewCount = useMemo(() => {
    if (extendedCourse?.averageRating !== undefined && extendedCourse?.averageRating !== null && extendedCourse?.averageRating > 0) {
      return Math.max(0, Math.min(5, extendedCourse.averageRating));
    }
    
    const reviews = extendedCourse.ratingAndReviews || extendedCourse?.reviews || extendedCourse?.ratings || null;
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }
    
    const validReviews = reviews.filter((r: Review | unknown) => {
      if (!r || typeof r !== 'object') return false;
      const review = r as Review;
      const ratingValue = review.rating !== undefined ? review.rating : (review.ratingValue !== undefined ? review.ratingValue : null);
      return ratingValue !== null && ratingValue !== undefined && !isNaN(Number(ratingValue));
    });
    
    if (validReviews.length === 0) {
      return 0;
    }
    
    const normalizedReviews = (validReviews as Review[]).map((r: Review) => ({
      rating: r.rating !== undefined ? r.rating : (r.ratingValue || 0)
    }));
    
    const rating = GetAvgRating(normalizedReviews);
    const finalRating = Math.max(0, Math.min(5, rating || 0));
    
    if (process.env.NODE_ENV === 'development' && finalRating > 0) {
      console.log('CourseCard - Calculated rating from reviews:', {
        courseName: extendedCourse?.courseName,
        calculatedRating: finalRating,
        validReviewsCount: validReviews.length,
        totalReviewsCount: reviews.length
      });
    }
    
    return finalRating;
  }, [extendedCourse]);
  
  // Course ID Validation
  const courseId = extendedCourse?.id || extendedCourse?._id;
  
  if (!courseId) {
    console.error("Course ID is missing for course:", extendedCourse?.courseName);
    return null;
  }

  // Duration Badge
  const badgeDuration = formatDurationForBadge(
    typeof extendedCourse?.totalDuration === 'number' ? extendedCourse.totalDuration : undefined
  );

  return (
    <div className="h-full flex w-full">
      <Link href={`/courses/${courseId}`} className="h-full w-full flex flex-col group">
        <div className="bg-richblack-800 rounded-2xl overflow-hidden border border-richblack-700 hover:border-yellow-50/50 transition-all duration-300 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 w-full transform hover:-translate-y-1">
          {/* Thumbnail Image */}
          <div className={`${Height} w-full overflow-hidden flex-shrink-0 relative bg-richblack-900`}>
            {extendedCourse?.thumbnail ? (
              <Img
                src={extendedCourse.thumbnail}
                alt={extendedCourse?.courseName || "course thumbnail"}
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
            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/80 via-richblack-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10"></div>
            
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium text-purple-800">{badgeDuration}</span>
              </div>
            </div>
          </div>
          
          {/* Course Information */}
          <div className="flex flex-col flex-grow p-5 min-h-[220px] justify-between">
            <div className="flex flex-col gap-3.5 flex-grow">
              <h3 className="text-xl font-bold text-richblack-5 line-clamp-2 leading-snug group-hover:text-yellow-50 transition-colors duration-200 min-h-[3.5rem]">
                {extendedCourse?.courseName}
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-richblack-300 text-xs font-semibold">
                    {extendedCourse?.instructor?.firstName?.[0] || "I"}
                    {extendedCourse?.instructor?.lastName?.[0] || ""}
                  </span>
                </div>
                <p className="text-sm text-richblack-300 font-medium truncate">
                  {extendedCourse?.instructor?.firstName} {extendedCourse?.instructor?.lastName}
                </p>
              </div>
              
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 bg-richblack-700/50 px-3 py-1.5 rounded-lg">
                  <span className="text-yellow-50 font-bold text-base">
                    {avgReviewCount > 0 ? avgReviewCount.toFixed(1) : "0.0"}
                  </span>
                  <RatingStars Review_Count={avgReviewCount} />
                </div>
                <span className="text-richblack-400 text-xs font-medium">
                  ({extendedCourse?.totalReviews ?? (Array.isArray(extendedCourse?.ratingAndReviews) ? extendedCourse.ratingAndReviews.length : 0)} reseñas)
                </span>
              </div>
              
              {extendedCourse?.totalStudentsEnrolled !== undefined && (
                <div className="flex items-center gap-1.5 text-richblack-400 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span className="font-medium">
                    {extendedCourse.totalStudentsEnrolled} estudiantes
                  </span>
                </div>
              )}
            </div>
            
            {/* Pricing */}
            <div className="mt-4 pt-4 border-t border-richblack-700">
              <p className="text-xl font-bold text-yellow-50">
                Rs. {extendedCourse?.price}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseCard;
