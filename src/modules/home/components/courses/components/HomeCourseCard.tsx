"use client";

import React from "react";
import Link from "next/link";
import { Img } from "@shared/components";
import { RatingStars } from "@shared/components";
import GetAvgRating from "@shared/utils/avgRating";
import type { Course } from "../../../../courses/types";
import { formatDurationForBadge } from "../../../utils";

interface HomeCourseCardProps {
  course: Course;
  index?: number;
}

export const HomeCourseCard: React.FC<HomeCourseCardProps> = ({
  course,
  index = 0,
}) => {
  const courseId = course.id;
  const avgRating = GetAvgRating(course.ratingAndReviews || []);
  const reviewCount = course.ratingAndReviews?.length || 0;
  const badgeDuration = formatDurationForBadge(
    typeof course.totalDuration === "number" ? course.totalDuration : undefined,
  );

  const instructor = course.instructor;
  const category = course.category;

  const animationDelay = index * 0.1;

  return (
    <Link
      href={`/courses/${courseId}`}
      className="group bg-white rounded-xl border border-cem-neutral-gray-200 overflow-hidden hover:border-cem-primary hover:shadow-lg transition-all duration-300 flex flex-col course-card-float h-full"
      style={{
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Imagen con badge de duración */}
      <div className="relative w-full h-48 md:h-40 bg-cem-neutral-gray-100 overflow-hidden">
        {course.thumbnail ? (
          <Img
            src={course.thumbnail}
            alt={course.courseName || "Course thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cem-teal-50 to-cem-teal-100 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-cem-neutral-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge de duración */}
        <div className="absolute top-2.5 right-2.5 bg-white rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm z-10">
          <svg
            className="w-3.5 h-3.5 text-purple-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium text-purple-800">
            {badgeDuration}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Categoría */}
        <span className="text-xs font-semibold text-cem-primary mb-1.5">
          {category.name}
        </span>

        {/* Título con flecha - min-h para alinear descripciones */}
        <div className="flex items-start justify-between gap-2 mb-1.5 min-h-[48px]">
          <h3 className="text-base font-bold text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors flex-1 leading-snug line-clamp-2">
            {course.courseName || "Curso sin título"}
          </h3>
          <svg
            className="w-4 h-4 text-cem-primary flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>

        {/* Descripción */}
        <p className="text-sm text-cem-neutral-gray-600 mb-3 line-clamp-2">
          {course.courseDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-cem-neutral-gray-900">
              {avgRating.toFixed(1)}
            </span>
            <RatingStars Review_Count={avgRating} Star_Size={14} />
          </div>
          <span className="text-sm text-cem-neutral-gray-500">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Instructor y Precio */}
        <div className="mt-auto pt-3 border-t border-cem-neutral-gray-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-cem-teal-100 flex items-center justify-center flex-shrink-0">
              <span className="text-cem-primary font-semibold text-sm">
                {instructor.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cem-neutral-gray-900 truncate">
                {instructor.name}
              </p>
              <p className="text-xs text-cem-neutral-gray-500 truncate">
                {instructor.professional_title}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <p className="text-xl font-bold text-cem-primary">
              S/{course.price || 0}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
