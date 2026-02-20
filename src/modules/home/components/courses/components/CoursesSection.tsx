"use client";

import React from "react";
import Link from "next/link";
import type { Course } from "../../../../courses/types";
import { HomeCourseCard } from "./HomeCourseCard";
import { CoursesError } from "./CoursesError";
import { CoursesSectionHeader } from "./CoursesSectionHeader";
import LoadingSpinner from "@shared/components/ui/Loading";
import { useCarousel } from "@shared/hooks/useCarousel";

interface CoursesSectionProps {
  courses: Course[] | null | undefined;
  loading?: boolean;
  error?: boolean;
}



export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  loading,
  error,
}) => {
  const {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useCarousel();

  if (loading) return <LoadingSpinner />;
  if (error) return <CoursesError />;

  return (
    <div className="w-full bg-white ">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <CoursesSectionHeader />

        {/* Mobile Carousel - ONLY MOBILE */}
        <div className="w-full md:hidden">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto gap-4 px-6 -mx-4 pb-10 no-scrollbar cursor-grab active:cursor-grabbing ${!isDragging ? "snap-x snap-mandatory" : ""
              }`}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}} />
            {courses?.map((course, index) => (
              <div
                key={course.id || index}
                className="flex-shrink-0 w-[88%] snap-center"
              >
                <HomeCourseCard course={course} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout - HIDDEN ON MOBILE */}
        <div className="w-full mx-auto hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-[calc(100%-160px)] mx-auto">
            {courses?.map((course, index) => (
              <div
                key={course.id || index}
                className="max-w-sm mx-auto w-full md:max-w-none h-full"
              >
                <HomeCourseCard course={course} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href={"/courses"}
            className="inline-flex items-center gap-2 px-6 py-3 border border-cem-neutral-gray-300 rounded-lg text-cem-neutral-gray-700 font-medium hover:bg-cem-neutral-gray-50 hover:border-cem-primary hover:text-cem-primary transition-all duration-200"
          >
            Explorar todos los cursos y programas
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
