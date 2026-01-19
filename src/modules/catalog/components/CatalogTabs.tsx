"use client";

import React, { useMemo, useState } from "react";
import CourseSlider from "./CourseSlider";
import { CatalogTabsProps, Course } from "../types";
import GetAvgRating from "@shared/utils/avgRating";
import { FiSearch, FiX } from "react-icons/fi";

/**
 * CatalogTabs - Tabs component for catalog page
 * Displays tabs and course slider based on active tab
 */
const CatalogTabs: React.FC<CatalogTabsProps> = ({
  catalogPageData,
  active,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar y ordenar cursos según la pestaña activa y búsqueda
  const filteredCourses = useMemo(() => {
    let courses = catalogPageData?.selectedCategory?.courses || [];
    
    // Aplicar filtro de búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      courses = courses.filter((course: Course) => {
        const courseName = course.courseName?.toLowerCase() || "";
        const instructorName = `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.toLowerCase();
        const categoryName = catalogPageData?.selectedCategory?.name?.toLowerCase() || "";
        
        return (
          courseName.includes(query) ||
          instructorName.includes(query) ||
          categoryName.includes(query)
        );
      });
    }
    
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
  }, [catalogPageData?.selectedCategory?.courses, catalogPageData?.selectedCategory?.name, active, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
      <div className="section_heading mb-6">Cursos para comenzar</div>
      
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-richblack-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar cursos por nombre, instructor o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-12 py-3.5 bg-richblack-800 border border-richblack-700 rounded-xl text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50/50 focus:border-yellow-50/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-richblack-200 transition-colors"
            >
              <FiX className="h-5 w-5 text-richblack-400" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-richblack-400">
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? "s" : ""} encontrado{filteredCourses.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Tabs */}
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
      
      {/* Cursos */}
      {filteredCourses.length > 0 ? (
        <div>
          <CourseSlider Courses={filteredCourses} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-richblack-400 text-lg">
            {searchQuery
              ? "No se encontraron cursos con tu búsqueda"
              : "No hay cursos disponibles en esta categoría"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogTabs;
