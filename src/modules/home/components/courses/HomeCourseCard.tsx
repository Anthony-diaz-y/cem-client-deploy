"use client";
import React from "react";
import Link from "next/link";
import { Img } from "@shared/components";
import { RatingStars } from "@shared/components";
import GetAvgRating from "@shared/utils/avgRating";
import type { Course } from "../../../catalog/types";
import { formatDurationForBadge } from "../../utils";

interface HomeCourseCardProps {
  course: Course;
  index?: number;
}

export const HomeCourseCard: React.FC<HomeCourseCardProps> = ({ course, index = 0 }) => {
  const courseId = course._id;
  const avgRating = GetAvgRating(course.ratingAndReviews || []);
  const reviewCount = course.ratingAndReviews?.length || 0;
  const badgeDuration = formatDurationForBadge(
    typeof course.totalDuration === 'number' ? course.totalDuration : undefined
  );

  const instructorName = course.instructor
    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
    : "Instructor";

  const animationDelay = index * 0.1;

  return (
    <Link
      href={`/courses/${courseId}`}
      className="group bg-white rounded-xl border border-cem-neutral-gray-200 overflow-hidden hover:border-cem-primary hover:shadow-lg transition-all duration-300 flex flex-col course-card-float"
      style={{
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Imagen con badge de duración */}
      <div className="relative w-full h-48 bg-cem-neutral-gray-100 overflow-hidden">
        {course.thumbnail ? (
          <Img
            src={course.thumbnail}
            alt={course.courseName || "Course thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cem-teal-50 to-cem-teal-100 flex items-center justify-center">
            <svg className="w-16 h-16 text-cem-neutral-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badge de duración */}
        <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm z-10">
          <svg className="w-4 h-4 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-purple-800">{badgeDuration}</span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Categoría */}
        <span className="text-xs font-semibold text-cem-primary mb-2">
          Biología y Biotecnología
        </span>

        {/* Título con flecha */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors flex-1">
            {course.courseName || "Curso sin título"}
          </h3>
          <svg className="w-4 h-4 text-cem-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Descripción */}
        <p className="text-sm text-cem-neutral-gray-600 mb-4 line-clamp-2">
          Estudio de cómo el ADN, ARN y proteínas regulan la vida celular.
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
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
        <div className="mt-auto pt-4 border-t border-cem-neutral-gray-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-cem-teal-100 flex items-center justify-center flex-shrink-0">
              <span className="text-cem-primary font-semibold text-sm">
                {instructorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cem-neutral-gray-900 truncate">
                {instructorName}
              </p>
              <p className="text-xs text-cem-neutral-gray-500 truncate">
                Biólogo experto
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <p className="text-2xl font-bold text-cem-primary">
              S/{course.price || 0}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

