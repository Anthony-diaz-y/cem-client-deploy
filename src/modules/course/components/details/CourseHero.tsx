"use client";

import React from "react";
import { RatingStars } from "@shared/components";
import { CourseHeroProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

/**
 * CourseHero - Hero section for course details page
 * Displays course title, description, rating, and enrollment stats
 */
const CourseHero: React.FC<CourseHeroProps> = ({ course, avgReviewCount }) => {
  const { courseName, courseDescription, ratingAndReviews, studentsEnrolled } =
    course;

  const reviewCount = ratingAndReviews?.length ?? 0;
  const enrolledCount = studentsEnrolled?.length ?? 0;

  return (
    <div className="mb-0">
      <h1 className="text-4xl lg:text-[42px] font-bold text-cem-neutral-gray-900 mb-4 leading-tight">
        {courseName}
      </h1>

      {/* Course Tags/Categories */}
      {course.category && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(Array.isArray(course.category) ? course.category : [course.category]).map((category, ind) => {
            const colors = [
              "bg-purple-100 text-purple-700",
              "bg-green-100 text-green-700",
              "bg-blue-100 text-blue-700",
              "bg-pink-100 text-pink-700",
              "bg-amber-100 text-amber-700",
              "bg-cyan-100 text-cyan-700",
            ];
            const colorClass = colors[ind % colors.length];

            return (
              <span
                key={ind}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-default ${colorClass}`}
              >
                {category.name}
              </span>
            );
          })}
        </div>
      )}

      <p className="text-lg text-cem-neutral-gray-700 leading-relaxed mb-6 max-w-3xl">
        {courseDescription}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-cem-neutral-gray-800 font-medium">
        <span className="text-[#F2994A] font-bold text-lg">
          {avgReviewCount || "0.0"}
        </span>
        <RatingStars Review_Count={avgReviewCount} Star_Size={18} />
        <span className="underline cursor-pointer hover:text-cem-primary transition-colors ml-1">
          ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
        </span>
        <span className="mx-2 text-cem-neutral-gray-400">•</span>
        <span>
          {enrolledCount}{" "}
          {enrolledCount === 1
            ? COURSE_TEXTS.hero.student.singular
            : COURSE_TEXTS.hero.student.plural}
        </span>
      </div>
    </div>
  );
};

export default CourseHero;
