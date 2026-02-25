import { apiConnector } from "@shared/services/apiConnector";
import { categories } from "@shared/services/apis";
import type { CatalogGroup } from "../types";

/** Obtiene todas las categorías agrupadas (Carreras/Sectores) para el catálogo */
export const getCatalogGroups = async (): Promise<CatalogGroup[]> => {
  try {
    const response = await apiConnector<any>(
      "GET",
      categories.GET_PUBLIC_CATEGORIES_API,
    );

    // El servidor ahora devuelve las categorías agrupadas por tipo (Carrera/Sector)
    if (response?.data?.success && Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching grouped categories:", error);
    return [];
  }
};
