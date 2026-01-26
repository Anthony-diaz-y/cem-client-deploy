import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { getCatalogPageData } from "@shared/services/pageAndComponentData";
import { Category, CatalogPageData } from "../types";

/**
 * Hook personalizado para obtener y gestionar los datos del catálogo.
 * Maneja la carga de categorías y cursos basándose en el parámetro de la URL.
 */
export const useCatalogData = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState<CatalogPageData | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  /**
   * Valida si un string tiene formato UUID válido.
   */
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  /**
   * Normaliza un nombre de categoría para comparación (espacios a guiones, minúsculas).
   */
  const normalizeCategoryName = (name: string): string => {
    return name.split(" ").join("-").toLowerCase().trim();
  };

  /**
   * Obtiene el ID de categoría desde el nombre en la URL.
   * Busca la categoría correspondiente y establece su ID.
   */
  useEffect(() => {
    const catalogNameRaw = Array.isArray(catalogName) ? catalogName[0] : catalogName;

    if (!catalogNameRaw) {
      setLoading(false);
      setCatalogPageData(null);
      setCategoryId("");
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const categories = (await fetchCourseCategories()) as Category[];
        let catalogNameStr: string;

        try {
          catalogNameStr = decodeURIComponent(catalogNameRaw);
        } catch {
          catalogNameStr = catalogNameRaw;
        }

        const normalizedCatalogName = normalizeCategoryName(catalogNameStr);
        const category = categories.find((ct: Category) => 
          normalizeCategoryName(ct.name) === normalizedCatalogName
        );

        if (!category) {
          console.error("Category not found for catalogName:", catalogNameStr);
          setLoading(false);
          return;
        }

        const categoryId = (category as Category & { id?: string })?.id || category?._id;

        if (!categoryId) {
          console.error("Category ID not found for catalogName:", catalogNameStr);
          setLoading(false);
          return;
        }

        if (!isValidUUID(categoryId)) {
          console.error("Invalid category ID format (expected UUID):", categoryId);
          setLoading(false);
          return;
        }

        setCategoryId(categoryId);
      } catch (error) {
        console.error("Could not fetch Categories.", error);
        setLoading(false);
      }
    })();
  }, [catalogName]);

  /**
   * Obtiene los datos de la página del catálogo (cursos) para la categoría seleccionada.
   */
  useEffect(() => {
    if (!categoryId) {
      setCatalogPageData(null);
      return;
    }

    if (!isValidUUID(categoryId)) {
      console.error("Invalid category ID format (expected UUID):", categoryId);
      setCatalogPageData(null);
      setLoading(false);
      return;
    }

    setCatalogPageData(null);

    (async () => {
      try {
        const res = await getCatalogPageData(categoryId);
        if (res && typeof res === 'object' && 'selectedCategory' in res) {
          setCatalogPageData(res as CatalogPageData);
        } else {
          setCatalogPageData(null);
        }
      } catch (error) {
        console.error("Error fetching catalog page data:", error);
        setCatalogPageData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  return { catalogPageData, loading };
};
