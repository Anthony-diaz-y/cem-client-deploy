import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { getCatalogPageData } from "@shared/services/pageAndComponentData";
import { Category, CatalogPageData } from "../types";

/**
 * Custom hook to fetch and manage catalog data
 * Separates data fetching logic from component
 */
export const useCatalogData = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] =
    useState<CatalogPageData | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para validar UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Fetch All Categories
  useEffect(() => {
    (async () => {
      try {
        const res = (await fetchCourseCategories()) as Category[];
        const catalogNameRaw = Array.isArray(catalogName)
          ? catalogName[0]
          : catalogName;
        
        if (!catalogNameRaw) return;
        
        // Decodificar el catalogName de URL encoding (ej: programaci%C3%B3n -> programación)
        let catalogNameStr: string;
        try {
          catalogNameStr = decodeURIComponent(catalogNameRaw);
        } catch (error) {
          // Si falla la decodificación, usar el valor original
          console.warn("Failed to decode catalogName, using raw value:", catalogNameRaw);
          catalogNameStr = catalogNameRaw;
        }
        
        if (catalogNameStr) {
          // Normalizar el nombre para comparar: convertir espacios a guiones y a minúsculas
          const normalizedCatalogName = catalogNameStr.toLowerCase().trim();
          
          const category = res.find((ct: Category) => {
            // Normalizar el nombre de la categoría de la misma manera
            const normalizedCategoryName = ct.name
              .split(" ")
              .join("-")
              .toLowerCase()
              .trim();
            
            return normalizedCategoryName === normalizedCatalogName;
          });
          
          if (!category) {
            console.error("Category not found for catalogName:", catalogNameStr);
            return;
          }

          // El backend PostgreSQL usa 'id' (UUID), pero mantenemos compatibilidad con '_id'
          // Priorizar 'id' sobre '_id' ya que el backend usa UUIDs
          const category_id = (category as any)?.id || category?._id;
          
          if (category_id) {
            // Validar que sea un UUID válido
            if (!isValidUUID(category_id)) {
              console.error(
                "Invalid category ID format (expected UUID):", 
                category_id, 
                "for category:",
                category.name
              );
              console.error("This looks like a MongoDB ObjectId. Make sure you're using IDs from the backend.");
              return;
            }
            
            console.log("Category ID found (UUID):", category_id, "for category:", category?.name);
            setCategoryId(category_id);
          } else {
            console.error("Category ID not found for catalogName:", catalogNameStr, "Category:", category);
          }
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
    })();
  }, [catalogName]);

  // Función para validar UUID (duplicada para uso en useEffect)
  const isValidUUIDInEffect = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Fetch Catalog Page Data
  useEffect(() => {
    if (categoryId) {
      // Validar formato UUID antes de hacer la petición
      if (!isValidUUIDInEffect(categoryId)) {
        console.error("Invalid category ID format (expected UUID):", categoryId);
        setCatalogPageData(null);
        setLoading(false);
        return;
      }

      (async () => {
        setLoading(true);
        try {
          const res = await getCatalogPageData(categoryId);
          // Si res es null, significa que no hay cursos para esta categoría
          // pero aún así queremos mostrar el estado vacío, así que no establecemos catalogPageData
          if (res && typeof res === 'object' && 'selectedCategory' in res) {
            setCatalogPageData(res as CatalogPageData);
          } else {
            // No hay datos, establecer a null para mostrar el estado vacío
            setCatalogPageData(null);
          }
        } catch (error) {
          console.error("Error fetching catalog page data:", error);
          setCatalogPageData(null);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  return { catalogPageData, loading };
};
