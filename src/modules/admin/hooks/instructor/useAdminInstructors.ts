import { useState, useEffect, useCallback, useRef } from "react";
import { getAllInstructors, InstructorFilters, Instructor } from "@shared/services/adminAPI";

interface UseAdminInstructorsReturn {
  instructors: Instructor[];
  counts: { total: number; approved: number; pending: number; active: number; inactive: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
  filters: InstructorFilters;
  loading: boolean;
  searching: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handlePageChange: (newPage: number) => void;
  handleStatusChange: (status: "approved" | "pending" | "all") => void;
  handleActiveChange: (active: boolean | undefined) => void;
  refreshInstructors: () => void;
}

export function useAdminInstructors(token: string | null): UseAdminInstructorsReturn {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<InstructorFilters>({
    status: "all",
    active: undefined,
    search: "",
    page: 1,
    limit: 10,
  });
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    active: 0,
    inactive: 0,
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const fetchInstructors = useCallback(async (currentFilters: InstructorFilters, showLoading = true) => {
    if (!token) return;
    if (showLoading) {
      setLoading(true);
    } else {
      setSearching(true);
    }
    try {
      const response = await getAllInstructors(token, currentFilters, true);
      if (response) {
        setInstructors(response.data.all || []);
        setCounts({
          total: response.counts.total || 0,
          approved: response.counts.approved || 0,
          pending: response.counts.pending || 0,
          active: response.counts.active || 0,
          inactive: response.counts.inactive || 0,
        });
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (error) {
      setInstructors([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [token]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedSearch = searchInput.trim();
    if (trimmedSearch === "") {
      setFilters((prev) => ({ ...prev, search: "", page: 1 }));
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: trimmedSearch, page: 1 }));
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;

    const showLoading = isInitialMount.current;
    fetchInstructors(filters, showLoading);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [token, filters.status, filters.active, filters.search, filters.page, filters.limit, fetchInstructors]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleStatusChange = useCallback((status: "approved" | "pending" | "all") => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleActiveChange = useCallback((active: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, active, page: 1 }));
  }, []);

  const refreshInstructors = useCallback(() => {
    fetchInstructors(filters, false);
  }, [filters, fetchInstructors]);

  return {
    instructors,
    counts,
    meta,
    filters,
    loading,
    searching,
    searchInput,
    setSearchInput,
    handlePageChange,
    handleStatusChange,
    handleActiveChange,
    refreshInstructors,
  };
}


