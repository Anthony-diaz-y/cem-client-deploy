import { useState, useEffect, useCallback, useRef } from "react";
import { getAllCoursesAdmin, AdminCourse } from "@shared/services/adminAPI";

interface UseAdminCoursesReturn {
  courses: AdminCourse[];
  counts: { total: number; published: number; draft: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string;
    categoryId: string;
    instructorId: string;
  };
  loading: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handlePageChange: (newPage: number) => void;
  loadMore: () => void;
  handleFiltersChange: (newFilters: {
    search?: string;
    status?: string;
    categoryId?: string;
    instructorId?: string;
  }) => void;
  refreshCourses: () => void;
}

export function useAdminCourses(
  token: string | null,
  initialSearch?: string
): UseAdminCoursesReturn {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(initialSearch || "");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12, // Aumentado de 6 a 12 para reducir el número de peticiones
    search: initialSearch || "",
    status: "all",
    categoryId: "all",
    instructorId: "all",
  });
  const [counts, setCounts] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const fetchCourses = useCallback(async (currentFilters: typeof filters, showLoading = true, append = false) => {
    if (!token) return;
    if (showLoading && !append) {
      setLoading(true);
    }
    try {
      const backendFilters: Record<string, string | number | undefined> = {
        page: currentFilters.page,
        limit: currentFilters.limit,
      };

      if (currentFilters.search?.trim()) backendFilters.search = currentFilters.search.trim();
      if (currentFilters.status !== "all") backendFilters.status = currentFilters.status;
      if (currentFilters.categoryId !== "all") backendFilters.categoryId = currentFilters.categoryId;
      if (currentFilters.instructorId !== "all") backendFilters.instructorId = currentFilters.instructorId;

      const response = await getAllCoursesAdmin(token, backendFilters, true);

      if (response && response.success) {
        const coursesData = response.data || [];
        const newMeta = response.meta || {
          page: currentFilters.page || 1,
          limit: currentFilters.limit || 6,
          total: response.count || coursesData.length,
          totalPages: Math.ceil((response.count || 1) / (currentFilters.limit || 6))
        };

        if (append) {
          setCourses(prev => [...prev, ...coursesData]);
        } else {
          setCourses(coursesData);
        }

        setMeta(newMeta);

        if (response.counts) {
          setCounts(response.counts);
        } else {
          setCounts({
            total: response.count || coursesData.length,
            published: 0,
            draft: 0
          });
        }
      }
    } catch {
      if (!append) setCourses([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput.trim(),
        page: 1
      }));
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;
    const isLoadMore = filters.page > 1;
    fetchCourses(filters, isInitialMount.current, isLoadMore);

    if (isInitialMount.current) isInitialMount.current = false;
  }, [token, filters, fetchCourses]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const loadMore = useCallback(() => {
    if (loading || meta.page >= meta.totalPages) return;
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  }, [loading, meta.page, meta.totalPages]);

  const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const refreshCourses = useCallback(() => {
    fetchCourses(filters, false);
  }, [filters, fetchCourses]);

  return {
    courses,
    counts,
    meta,
    filters,
    loading,
    searchInput,
    setSearchInput,
    handlePageChange, // Mantener por compatibilidad si es necesario
    loadMore,
    handleFiltersChange,
    refreshCourses,
  };
}


