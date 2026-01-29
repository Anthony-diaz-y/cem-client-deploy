import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories, getCourses } from "../services/coursesAPI";
import type { Category, Course } from "../types";

export function useCoursesData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  
  const [error, setError] = useState<boolean>(false);
  const [meta, setMeta] = useState<{ page?: number; limit?: number; total?: number; totalPages?: number } | undefined>(undefined);

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-driven state
  const search = useMemo(() => (searchParams.get("search") || "").trim(), [searchParams]);
  const category = useMemo(() => (searchParams.get("category") || "").trim(), [searchParams]);
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page") || "1");
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const limit = 9;

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) {
        // First load
      } else {
        setIsFetching(true);
      }

      setError(false);

      try {
        const [coursesRes, categoriesData] = await Promise.all([
          getCourses({ 
            search: search || undefined, 
            category: category || undefined,
            page, 
            limit 
          }),
          getCategories(),
        ]);

        setCourses(coursesRes.courses || []);
        setMeta(coursesRes.meta);

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData as Category[]);
        }
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

  const setPage = useCallback(
    (nextPage: number) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("page", String(nextPage));
      if (search) sp.set("search", search);
      else sp.delete("search");
      if (category) sp.set("category", category);
      else sp.delete("category");
      
      router.push(`/courses?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams, search, category],
  );

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

  const setCategory = useCallback(
    (cat: string) => {
      const value = cat.trim();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("page", "1");
      if (value) sp.set("category", value);
      else sp.delete("category");
      if (search) sp.set("search", search);
      else sp.delete("search");
      
      router.push(`/courses?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams, search],
  );

  return { 
    courses, 
    categories, 
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
    setCategory
  };
}
