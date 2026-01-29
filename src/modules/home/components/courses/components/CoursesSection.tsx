"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Course } from "../../../../catalog/types";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { HomeCourseCard } from "./HomeCourseCard";
import { CoursesLoadingSpinner } from "./CoursesLoadingSpinner";
import { CoursesError } from "./CoursesError";
import { CoursesSectionHeader } from "./CoursesSectionHeader";

interface CoursesSectionProps {
  courses: Course[] | null | undefined;
  loading?: boolean;
  error?: boolean;
}

const MAX_COURSES_DISPLAY = 6;

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  loading,
  error,
}) => {
  const [catalogLink, setCatalogLink] = useState<string>("/catalog");

  useEffect(() => {
    const getFirstCategory = async () => {
      try {
        const categories = await fetchCourseCategories();
        if (categories?.length > 0) {
          const categoryName = categories[0].name
            .split(" ")
            .join("-")
            .toLowerCase();
          setCatalogLink(`/catalog/${categoryName}`);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getFirstCategory();
  }, []);

  if (loading) return <CoursesLoadingSpinner />;
  if (error) return <CoursesError />;

  const displayCourses = courses?.slice(0, MAX_COURSES_DISPLAY) || [];
  if (displayCourses.length === 0) return null;

  return (
    <div className="w-full bg-white py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        <CoursesSectionHeader />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course, index) => (
              <div
                key={course._id || index}
                className="max-w-sm mx-auto w-full md:max-w-none h-full"
              >
                <HomeCourseCard course={course} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href={catalogLink}
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

