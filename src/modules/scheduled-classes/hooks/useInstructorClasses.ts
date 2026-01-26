import { useState, useEffect, useCallback, useRef } from "react";
import { obtenerClases } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { ClaseProgramada, ParametrosConsultaClases, Platform } from "@/types/scheduledClasses.types";
import toast from "react-hot-toast";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

interface UseInstructorClassesReturn {
  classes: ClaseProgramada[];
  statistics: { total: number; active: number; inactive: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
  filters: ParametrosConsultaClases;
  initialLoading: boolean;
  isFiltering: boolean;
  handlePageChange: (newPage: number) => void;
  handleSearch: (search: string) => void;
  handlePlatformChange: (platform: Platform | 'all') => void;
  handleStatusChange: (isActive: boolean | null) => void;
  handleCreatedByChange: (createdBy: string) => void;
  handleDateChange: (date: string | null) => void;
  handleClearFilters: () => void;
  refreshClasses: () => void;
}

export function useInstructorClasses(token: string | null): UseInstructorClassesReturn {
  const [classes, setClasses] = useState<ClaseProgramada[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<ParametrosConsultaClases>({
    page: 1,
    limit: 10,
    search: undefined,
    platform: undefined,
    isActive: undefined,
    createdBy: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  const mountedRef = useRef(false);
  const hasLoadedOnceRef = useRef(false);

  const fetchClasses = useCallback(async (isInitial = false) => {
    if (!token) return;

    if (isInitial && hasLoadedOnceRef.current) return;

    if (isInitial && !hasLoadedOnceRef.current) {
      setInitialLoading(true);
      setIsFiltering(false);
    } else {
      setInitialLoading(false);
      setIsFiltering(true);
    }
    
    const timeoutId = setTimeout(() => {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setIsFiltering(false);
      }
      toast.error(SCHEDULED_CLASSES_TEXTS.hooks.useInstructorClasses.errors.timeout);
    }, 10000);

    try {
      const response = await obtenerClases(filters, token);
      clearTimeout(timeoutId);

      if (response?.success && response.data) {
        const clasesData = response.data.classes || [];
        const pagination = response.data.pagination || {
          total: response.data.total ?? 0,
          page: response.data.page ?? 1,
          limit: response.data.limit ?? 10,
          totalPages: response.data.totalPages ?? 0,
        };
        
        setClasses(clasesData);
        setMeta({
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        });

        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        } else {
          setStatistics({ total: 0, active: 0, inactive: 0 });
        }
      } else {
        setClasses([]);
        setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
        setStatistics({ total: 0, active: 0, inactive: 0 });
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(errorMessage || SCHEDULED_CLASSES_TEXTS.hooks.useInstructorClasses.errors.default);
      setClasses([]);
      setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
      setStatistics({ total: 0, active: 0, inactive: 0 });
    } finally {
      if (isInitial) {
        setInitialLoading(false);
        hasLoadedOnceRef.current = true;
      } else {
        setIsFiltering(false);
      }
    }
  }, [token, filters]);

  useEffect(() => {
    if (!token) return;
    
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchClasses(true);
      return;
    }
    
    if (hasLoadedOnceRef.current) {
      fetchClasses(false);
    }
  }, [token, filters, fetchClasses]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    const trimmedSearch = search.trim();
    setFilters((prev) => ({ 
      ...prev, 
      search: trimmedSearch.length > 0 ? trimmedSearch : undefined, 
      page: 1 
    }));
  }, []);

  const handlePlatformChange = useCallback((platform: Platform | 'all') => {
    setFilters((prev) => ({ 
      ...prev, 
      platform: platform === 'all' ? undefined : platform, 
      page: 1 
    }));
  }, []);

  const handleStatusChange = useCallback((isActive: boolean | null) => {
    const newIsActive = isActive === null ? undefined : isActive;
    setFilters((prev) => ({ 
      ...prev, 
      isActive: newIsActive, 
      page: 1 
    }));
  }, []);

  const handleCreatedByChange = useCallback((createdBy: string) => {
    const trimmedCreatedBy = createdBy.trim();
    setFilters((prev) => ({ 
      ...prev, 
      createdBy: trimmedCreatedBy.length > 0 ? trimmedCreatedBy : undefined, 
      page: 1 
    }));
  }, []);

  const handleDateChange = useCallback((date: string | null) => {
    if (date) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        startDate: date,
        endDate: date,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        startDate: undefined,
        endDate: undefined,
      }));
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      search: undefined,
      platform: undefined,
      isActive: undefined,
      createdBy: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  }, []);

  const refreshClasses = useCallback(() => {
    hasLoadedOnceRef.current = false;
    fetchClasses(true);
  }, [fetchClasses]);

  return {
    classes,
    statistics,
    meta,
    filters,
    initialLoading,
    isFiltering,
    handlePageChange,
    handleSearch,
    handlePlatformChange,
    handleStatusChange,
    handleCreatedByChange,
    handleDateChange,
    handleClearFilters,
    refreshClasses,
  };
}

