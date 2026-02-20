"use client";

import React from "react";
import Link from "next/link";
import { Img } from "@shared/components";
import { RatingStars } from "@shared/components";
import GetAvgRating from "@shared/utils/avgRating";
import type { Course } from "../../../../courses/types";
import type { CoursePreview } from "../../../../categories/types";
import { formatDurationForBadge } from "../../../utils";

interface HomeCourseCardProps {
  course: Course | CoursePreview;
  index?: number;
  categoryName?: string; // Optional category name override
}

export const HomeCourseCard: React.FC<HomeCourseCardProps> = ({
  course,
  index = 0,
  categoryName,
}) => {
  const courseId = course.id;

  // Type guard para saber si es un objeto Course completo
  const isFullCourse = "instructor" in course || "instructors" in course;
  const fullCourse = isFullCourse ? (course as Course) : null;

  // Lógica para Rating y Reviews (Solo disponibles en Course)
  const avgRating = fullCourse
    ? typeof fullCourse.averageRating === "number"
      ? fullCourse.averageRating
      : GetAvgRating(fullCourse.ratingAndReviews || [])
    : 0;

  const reviewCount = fullCourse
    ? typeof fullCourse.totalReviews === "number"
      ? fullCourse.totalReviews
      : Array.isArray(fullCourse.ratingAndReviews)
        ? fullCourse.ratingAndReviews.length
        : 0
    : 0;

  // Lógica para Duración (Tipos distintos en las interfaces: number vs string)
  const durationValue =
    typeof course.totalDuration === "number"
      ? course.totalDuration
      : typeof course.totalDuration === "string"
        ? parseInt(course.totalDuration)
        : undefined;

  const badgeDuration = formatDurationForBadge(durationValue);

  // Lógica para Instructor (Solo disponible en el objeto Course)
  const displayInstructor = fullCourse
    ? fullCourse.instructors && fullCourse.instructors.length > 0
      ? fullCourse.instructors[0]
      : fullCourse.instructor
    : undefined;

  const instructorName = displayInstructor?.name || "Instructor";

  const instructorImage = displayInstructor?.image;
  const instructorTitle = displayInstructor?.additionalDetails?.professional_title || "Experto";

  // Lógica para Categorías (Estructuras distintas o IDs simples)
  const categories = fullCourse && Array.isArray(fullCourse.category)
    ? fullCourse.category
    : [];

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
        {/* Categorías */}
        {/* Categorías */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {categories.slice(0, 3).map((cat: { id?: string; name?: string }, index: number) => {
            const colors = [
              "bg-pink-100 text-pink-700",
              "bg-green-100 text-green-700",
              "bg-blue-100 text-blue-700",
              "bg-purple-100 text-purple-700",
              "bg-amber-100 text-amber-700",
              "bg-cyan-100 text-cyan-700",
            ];
            const colorClass =
              categoryName === cat.name
                ? "bg-cem-primary text-white"
                : colors[index % colors.length];

            return (
              <span
                key={cat.id || cat.name}
                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${colorClass}`}
              >
                {cat.name}
              </span>
            );
          })}
          {categories.length > 3 && (
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-cem-neutral-gray-100 text-cem-neutral-gray-600">
              +{categories.length - 3}
            </span>
          )}
        </div>

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
            <div className="w-9 h-9 rounded-full bg-cem-teal-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-cem-neutral-gray-100">
              {instructorImage ? (
                <Img src={instructorImage} alt={instructorName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-cem-primary font-semibold text-sm">
                  {instructorName.charAt(0).toUpperCase() || "I"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cem-neutral-gray-900 truncate">
                {instructorName}
              </p>
              <p className="text-xs text-cem-neutral-gray-500 truncate">
                {instructorTitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-lg font-bold text-cem-primary leading-tight">
              S/{course.price || 0}
            </p>
            <p className="text-xs font-medium text-cem-neutral-gray-500">
              $ {course.priceUSD ? Number(course.priceUSD).toFixed(2) : (Number(course.price || 0) / 3.75).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
