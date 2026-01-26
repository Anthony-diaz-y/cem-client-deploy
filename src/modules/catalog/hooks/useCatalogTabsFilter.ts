// Hook para manejar el filtrado y búsqueda en CatalogTabs
import { useState, useMemo } from "react";
import { CatalogPageData, Course } from "../types";
import GetAvgRating from "@shared/utils/avgRating";

export interface UseCatalogTabsFilterProps {
  catalogPageData: CatalogPageData;
  activeTab: number;
}

export interface UseCatalogTabsFilterReturn {
  searchQuery: string;
  filteredCourses: Course[];
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useCatalogTabsFilter({
  catalogPageData,
  activeTab,
}: UseCatalogTabsFilterProps): UseCatalogTabsFilterReturn {
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
    
    if (activeTab === 1) {
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
  }, [catalogPageData?.selectedCategory?.courses, catalogPageData?.selectedCategory?.name, activeTab, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    filteredCourses,
    setSearchQuery,
    clearSearch,
  };
}

