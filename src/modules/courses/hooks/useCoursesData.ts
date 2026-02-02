import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourses } from "../services/coursesAPI";
import type { Course } from "../types";

/** Hook principal para gestionar el estado y filtrado de cursos mediante URL */
export function useCoursesData(initialCategoryId?: string) {
  const [courses, setCourses] = useState<Course[]>([]);

  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);
  const [meta, setMeta] = useState<
    | { page?: number; limit?: number; total?: number; totalPages?: number }
    | undefined
  >(undefined);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Lee el parámetro 'search' de la URL
  const search = useMemo(
    () => (searchParams.get("search") || "").trim(),
    [searchParams],
  );

  // Lee el parámetro 'category' de la URL, con fallback opcional (aunque ya no se usa)
  const category = useMemo(() => {
    const urlCategory = searchParams.get("category");
    return (urlCategory || initialCategoryId || "").trim();
  }, [searchParams, initialCategoryId]);

  // Lee el parámetro 'page' de la URL
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page") || "1");
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const limit = 9;

  // Efecto principal: Carga cursos cuando cambian los filtros (search, category, page)
  useEffect(() => {
    // Si no hay filtros activos (ni búsqueda ni categoría), no hacemos fetch
    // Esto previene la llamada inicial innecesaria cuando se carga la página de categorías
    if (!search && !category) {
      setCourses([]);
      setInitialLoading(false);
      setIsFetching(false);
      return;
    }

    const fetchData = async () => {
      if (initialLoading) {
        // First load
      } else {
        setIsFetching(true);
      }

      setError(false);

      try {
        const coursesRes = await getCourses({
          search: search || undefined,
          category: category || undefined,
          page,
          limit,
        });

        setCourses(coursesRes.courses || []);
        setMeta(coursesRes.meta);
      } catch (error) {
        console.error("Error fetching courses data:", error);
        setError(true);
      } finally {
        setInitialLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, [search, category, page]);

  // Actualiza la página en la URL, manteniendo otros filtros
  const setPage = useCallback(
    (nextPage: number) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("page", String(nextPage));

      // Asegurar persistencia de filtros
      if (search) sp.set("search", search);
      else sp.delete("search");
      if (category) sp.set("category", category);
      else sp.delete("category");

      router.push(`/courses?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams, search, category],
  );

  // Actualiza la búsqueda en la URL y resetea a página 1
  const setSearch = useCallback(
    (q: string) => {
      const value = q.trim();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("page", "1");

      if (value) sp.set("search", value);
      else sp.delete("search");

      if (category) sp.set("category", category);
      else sp.delete("category");

      router.push(`/courses?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams, category],
  );

  // Actualiza la categoría en la URL y resetea a página 1 y búsqueda
  const setCategory = useCallback(
    (cat: string) => {
      const value = cat.trim();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("page", "1");

      if (value) sp.set("category", value);
      else sp.delete("category");

      // Limpiar búsqueda al cambiar categoría principal
      sp.delete("search");

      router.push(`/courses?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return {
    courses,
    loading: initialLoading,
    isFetching,
    error,
    search,
    category,
    page,
    limit,
    meta,
    setPage,
    setSearch,
    setCategory,
  };
}
