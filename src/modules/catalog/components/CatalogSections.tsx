"use client";

import React, { useMemo } from "react";
import CourseSlider from "./CourseSlider";
import CourseCard from "./CourseCard";
import { CatalogSectionsProps, Course } from "../types";
import GetAvgRating from "@shared/utils/avgRating";

/**
 * CatalogSections - Sections component for catalog page
 * Displays courses from the selected category and most selling courses
 */
const CatalogSections: React.FC<CatalogSectionsProps> = ({
  catalogPageData,
}) => {
  // Obtener cursos destacados de la categoría seleccionada (top rated)
  const topRatedCourses = useMemo(() => {
    const courses = catalogPageData?.selectedCategory?.courses || [];
    return [...courses]
      .sort((a: Course, b: Course) => {
        const ratingA = GetAvgRating(a.ratingAndReviews || []);
        const ratingB = GetAvgRating(b.ratingAndReviews || []);
        return ratingB - ratingA;
      })
      .slice(0, 6); // Top 6 cursos mejor valorados
  }, [catalogPageData?.selectedCategory?.courses]);

  // Filtrar cursos más vendidos que pertenezcan a la categoría seleccionada
  const mostSellingInCategory = useMemo(() => {
    const allMostSelling = catalogPageData?.mostSellingCourses || [];
    const categoryName = catalogPageData?.selectedCategory?.name?.toLowerCase();
    
    // Si hay cursos más vendidos, mostrar los primeros 4
    // Si no hay suficientes, complementar con cursos destacados de la categoría
    if (allMostSelling.length >= 4) {
      return allMostSelling.slice(0, 4);
    }
    
    // Combinar y tomar los primeros 4
    const combined = [...allMostSelling, ...topRatedCourses];
    return combined.slice(0, 4);
  }, [catalogPageData?.mostSellingCourses, topRatedCourses]);

  return (
    <>
      {/* Section 2 - Top Rated Courses in Selected Category */}
      {topRatedCourses.length > 0 && (
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">
            Cursos Mejor Valorados en {catalogPageData?.selectedCategory?.name}
          </div>
          <div>
            <CourseSlider Courses={topRatedCourses} />
          </div>
        </div>
      )}

      {/* Section 3 - Most Selling / Frequently Bought */}
      {mostSellingInCategory.length > 0 && (
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">Frecuentemente Comprados</div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {mostSellingInCategory.map((course: Course, i: number) => {
                const courseId = (course as any)?.id || course?._id || i;
                return (
                  <CourseCard
                    course={course}
                    key={courseId}
                    Height={"h-[320px]"}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogSections;
