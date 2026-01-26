// Hook para manejar la lógica de CatalogSections
import { useMemo } from "react";
import { CatalogPageData, Course } from "../types";
import GetAvgRating from "@shared/utils/avgRating";

export interface UseCatalogSectionsProps {
  catalogPageData: CatalogPageData;
}

export interface UseCatalogSectionsReturn {
  topRatedCourses: Course[];
  mostSellingInCategory: Course[];
}

export function useCatalogSections({
  catalogPageData,
}: UseCatalogSectionsProps): UseCatalogSectionsReturn {
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
    
    // Si hay cursos más vendidos, mostrar los primeros 4
    // Si no hay suficientes, complementar con cursos destacados de la categoría
    if (allMostSelling.length >= 4) {
      return allMostSelling.slice(0, 4);
    }
    
    // Combinar y tomar los primeros 4
    const combined = [...allMostSelling, ...topRatedCourses];
    return combined.slice(0, 4);
  }, [catalogPageData?.mostSellingCourses, topRatedCourses]);

  return {
    topRatedCourses,
    mostSellingInCategory,
  };
}

