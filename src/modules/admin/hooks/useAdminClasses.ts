import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { obtenerClasesAdmin } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { ClaseProgramada, ParametrosConsultaClases, Platform } from "@/types/scheduledClasses.types";
import toast from "react-hot-toast";

interface UseAdminClassesReturn {
  classes: ClaseProgramada[];
  statistics: { total: number; active: number; inactive: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
  filters: ParametrosConsultaClases & { instructorId?: string };
  initialLoading: boolean;
  isFiltering: boolean;
  creators: Array<{ id: string; firstName: string; lastName: string; accountType?: string }>;
  handlePageChange: (newPage: number) => void;
  handleSearch: (search: string) => void;
  handlePlatformChange: (platform: Platform | 'all') => void;
  handleStatusChange: (isActive: boolean | null) => void;
  handleCreatedByChange: (createdBy: string) => void;
  handleDateChange: (date: string | null) => void;
  handleInstructorChange: (instructorId: string | 'all') => void;
  handleClearFilters: () => void;
  refreshClasses: () => void;
}

export function useAdminClasses(token: string | null): UseAdminClassesReturn {
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
  const [filters, setFilters] = useState<ParametrosConsultaClases & { instructorId?: string }>({
    page: 1,
    limit: 10,
    search: undefined,
    platform: undefined,
    isActive: undefined,
    createdBy: undefined,
    startDate: undefined,
    endDate: undefined,
    instructorId: undefined,
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
      toast.error('La solicitud está tardando demasiado. Por favor, intenta nuevamente.');
    }, 10000);

    try {
      const { instructorId, ...apiFilters } = filters;
      const response = await obtenerClasesAdmin(apiFilters, token);
      clearTimeout(timeoutId);

      if (response?.success && response.data) {
        let filteredClasses = response.data.classes || [];

        if (instructorId) {
          filteredClasses = filteredClasses.filter(
            (c) => c.createdBy.id === instructorId && c.createdBy.accountType === 'Instructor'
          );
        }

        if (filters.isActive !== undefined) {
          filteredClasses = filteredClasses.filter(c => c.isActive === filters.isActive);
        }

        const pagination = response.data.pagination || {
          total: response.data.total ?? 0,
          page: response.data.page ?? 1,
          limit: response.data.limit ?? 10,
          totalPages: response.data.totalPages ?? 0,
        };

        setClasses(filteredClasses);

        if (instructorId || filters.isActive !== undefined) {
          const adjustedTotal = filteredClasses.length;
          setMeta({
            page: 1,
            limit: pagination.limit,
            total: adjustedTotal,
            totalPages: Math.max(1, Math.ceil(adjustedTotal / pagination.limit)),
          });
        } else {
          setMeta({
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages: pagination.totalPages,
          });
        }

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
      const errorStatus = (error as { response?: { status?: number } })?.response?.status;

      if (errorStatus === 403) {
        toast.error('No tienes permisos para acceder a esta sección.');
      } else if (errorStatus === 401) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        try {
          const { obtenerClases } = await import("@/shared/services/scheduledClasses/scheduledClassesAPI");
          const fallbackResponse = await obtenerClases(filters, token);
          if (fallbackResponse.success && fallbackResponse.data) {
            setClasses(fallbackResponse.data.classes);
            setMeta({
              page: fallbackResponse.data.page,
              limit: fallbackResponse.data.limit,
              total: fallbackResponse.data.total,
              totalPages: fallbackResponse.data.totalPages,
            });
            const activeCount = fallbackResponse.data.classes.filter((c: ClaseProgramada) => c.isActive).length;
            const inactiveCount = fallbackResponse.data.classes.filter((c: ClaseProgramada) => !c.isActive).length;
            setStatistics({
              total: fallbackResponse.data.total,
              active: activeCount,
              inactive: inactiveCount,
            });
          } else {
            setClasses([]);
            setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
            setStatistics({ total: 0, active: 0, inactive: 0 });
          }
        } catch {
          toast.error('Error al cargar las clases');
          setClasses([]);
          setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
          setStatistics({ total: 0, active: 0, inactive: 0 });
        }
      }
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

  const handleCreatedByChange = useCallback((createdBy: string) => {
    const trimmedCreatedBy = createdBy.trim();
    setFilters((prev) => ({
      ...prev,
      createdBy: trimmedCreatedBy.length > 0 ? trimmedCreatedBy : undefined,
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

  const handleInstructorChange = useCallback((instructorId: string | 'all') => {
    setFilters((prev) => ({
      ...prev,
      instructorId: instructorId === 'all' ? undefined : instructorId,
      page: 1
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      search: undefined,
      platform: undefined,
      createdBy: undefined,
      isActive: undefined,
      startDate: undefined,
      endDate: undefined,
      instructorId: undefined,
    });
  }, []);

  const refreshClasses = useCallback(() => {
    hasLoadedOnceRef.current = false;
    fetchClasses(true);
  }, [fetchClasses]);

  const creators = useMemo(() => {
    const uniqueCreators = Array.from(
      new Map(
        classes.map((c) => [c.createdBy.id, c.createdBy])
      ).values()
    );
    return uniqueCreators.map(creator => ({
      id: creator.id,
      firstName: creator.firstName,
      lastName: creator.lastName,
      accountType: creator.accountType,
    }));
  }, [classes]);

  return {
    classes,
    statistics,
    meta,
    filters,
    initialLoading,
    isFiltering,
    creators,
    handlePageChange,
    handleSearch,
    handlePlatformChange,
    handleStatusChange,
    handleCreatedByChange,
    handleDateChange,
    handleInstructorChange,
    handleClearFilters,
    refreshClasses,
  };
}

