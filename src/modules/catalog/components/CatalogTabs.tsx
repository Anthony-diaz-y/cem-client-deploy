"use client";

import React, { useMemo } from "react";
import CourseSlider from "./CourseSlider";
import { CatalogTabsProps, Course } from "../types";
import GetAvgRating from "@shared/utils/avgRating";

/**
 * CatalogTabs - Tabs component for catalog page
 * Displays tabs and course slider based on active tab
 */
const CatalogTabs: React.FC<CatalogTabsProps> = ({
  catalogPageData,
  active,
  onTabChange,
}) => {
  // Filtrar y ordenar cursos según la pestaña activa
  const filteredCourses = useMemo(() => {
    const courses = catalogPageData?.selectedCategory?.courses || [];
    
    if (active === 1) {
      // Most Popular: Ordenar por rating promedio y número de estudiantes
      return [...courses].sort((a: Course, b: Course) => {
        const ratingA = GetAvgRating(a.ratingAndReviews || []);
        const ratingB = GetAvgRating(b.ratingAndReviews || []);
        const studentsA = (a.studentsEnrolled?.length || 0);
        const studentsB = (b.studentsEnrolled?.length || 0);
        
        // Priorizar rating, luego número de estudiantes
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return studentsB - studentsA;
      });
    } else {
      // New: Ordenar por fecha de creación (más recientes primero)
      return [...courses].sort((a: Course, b: Course) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
  }, [catalogPageData?.selectedCategory?.courses, active]);

  return (
    <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
      <div className="section_heading">Cursos para comenzar</div>
      <div className="my-4 flex border-b border-b-richblack-600 text-sm">
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            active === 1
              ? "border-b-2 border-b-yellow-50 text-yellow-50 font-medium"
              : "text-richblack-50 hover:text-richblack-200"
          } cursor-pointer`}
          onClick={() => onTabChange(1)}
        >
          Más Populares
        </button>
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            active === 2
              ? "border-b-2 border-b-yellow-50 text-yellow-50 font-medium"
              : "text-richblack-50 hover:text-richblack-200"
          } cursor-pointer`}
          onClick={() => onTabChange(2)}
        >
          Nuevos
        </button>
      </div>
      <div>
        <CourseSlider Courses={filteredCourses} />
      </div>
    </div>
  );
};

export default CatalogTabs;
