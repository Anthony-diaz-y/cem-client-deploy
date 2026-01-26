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
    limit: 10,
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
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const fetchCourses = useCallback(async (currentFilters: typeof filters, showLoading = true) => {
    if (!token) return;
    if (showLoading) {
      setLoading(true);
    }
    try {
      const backendFilters: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        categoryId?: string;
        instructorId?: string;
      } = {};

      if (currentFilters.page) {
        backendFilters.page = currentFilters.page;
      }
      if (currentFilters.limit) {
        backendFilters.limit = currentFilters.limit;
      }

      if (currentFilters.search && currentFilters.search.trim() !== "") {
        backendFilters.search = currentFilters.search.trim();
      }

      if (currentFilters.status && currentFilters.status !== "all") {
        backendFilters.status = currentFilters.status;
      }

      if (currentFilters.categoryId && currentFilters.categoryId !== "all") {
        backendFilters.categoryId = currentFilters.categoryId;
      }

      if (currentFilters.instructorId && currentFilters.instructorId !== "all") {
        backendFilters.instructorId = currentFilters.instructorId;
      }

      const response = await getAllCoursesAdmin(token, backendFilters, true);

      if (response && response.success) {
        const coursesData = response.data || [];
        const metaData = response.meta || {
          page: currentFilters.page || 1,
          limit: currentFilters.limit || 10,
          total: response.count || coursesData.length,
          totalPages: Math.ceil((response.count || coursesData.length) / (currentFilters.limit || 10))
        };

        setCourses(coursesData);
        setMeta(metaData);

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
    } catch (error) {
      setCourses([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedSearch = searchInput.trim();

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: trimmedSearch,
        page: 1
      }));
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;

    const showLoading = isInitialMount.current;
    fetchCourses(filters, showLoading);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [token, filters.search, filters.status, filters.categoryId, filters.instructorId, filters.page, filters.limit, fetchCourses]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: {
    search?: string;
    status?: string;
    categoryId?: string;
    instructorId?: string;
  }) => {
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
    handlePageChange,
    handleFiltersChange,
    refreshCourses,
  };
}


