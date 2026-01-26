// Hook para obtener datos del catálogo para la página home
import { useState, useEffect } from "react";
import { getCatalogPageData } from "@shared/services/pageAndComponentData";
import { CatalogPageData } from "../types";

export function useHomeCatalogData() {
  const [catalogPageData, setCatalogPageData] = useState<CatalogPageData | null>(null);

  // Función para validar UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Fetch catalog page data - obtener categorías del backend y usar la primera
  useEffect(() => {
    const fetchCatalogPageData = async () => {
      try {
        // Obtener todas las categorías del backend
        const { fetchCourseCategories } = await import("@shared/services/courseDetailsAPI");
        const categories = (await fetchCourseCategories()) as Array<{
          id?: string;
          _id?: string;
          name: string;
        }>;

        if (!categories || categories.length === 0) {
          console.log("No categories found");
          return;
        }

        // Obtener el ID de la primera categoría (el backend usa 'id' para UUIDs)
        const firstCategory = categories[0];
        const categoryId = (firstCategory as any)?.id || firstCategory?._id;

        if (!categoryId) {
          console.error("Category ID not found for first category:", firstCategory);
          return;
        }

        // Validar que sea un UUID válido
        if (!isValidUUID(categoryId)) {
          console.error("Invalid category ID format (expected UUID):", categoryId);
          return;
        }

        console.log(
          "Using category ID from backend:",
          categoryId,
          "for category:",
          firstCategory.name
        );

        // Obtener datos de la categoría
        const result = await getCatalogPageData(categoryId);
        if (result) {
          setCatalogPageData(result as CatalogPageData);
        }
      } catch (error) {
        console.error("Error fetching catalog page data for home:", error);
      }
    };

    fetchCatalogPageData();
  }, []);

  return catalogPageData;
}


