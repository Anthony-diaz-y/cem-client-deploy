"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/course/AllCoursesTable";
import { getAllCoursesAdmin, AdminCourse } from "@shared/services/adminAPI";
import { Loading } from "@shared/components";

import Pagination from "@shared/components/common/Pagination";

export default function AllCoursesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAppSelector((state) => state.auth);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
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

  // Leer parámetros de búsqueda de la URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchInput(searchParam);
      setFilters((prev) => ({ ...prev, search: searchParam, page: 1 }));
    }
  }, [searchParams]);

  /**
   * Obtiene la lista de cursos con filtros de administrador
   */
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

        // Actualizar contadores si están disponibles
        if (response.counts) {
          setCounts(response.counts);
        } else {
          // Fallback manual si el backend aún no envía counts
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

  // Debounce para la búsqueda - UX optimizada
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

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  /**
   * Efecto para cargar cursos por cambio de filtros o página
   */
  useEffect(() => {
    if (!token) return;

    const showLoading = isInitialMount.current;

    fetchCourses(filters, showLoading);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [token, filters.search, filters.status, filters.categoryId, filters.instructorId, filters.page, filters.limit]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading && isInitialMount.current) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          Todos los Cursos
        </h1>
        <p className="text-richblack-400">
          Gestiona todos los cursos del sistema, tanto publicados como en borrador
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => router.push("/dashboard/add-course")}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
          >
            <span className="text-lg">+</span> Crear Curso
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Total de Cursos</p>
          <p className="text-2xl font-bold text-richblack-5">{counts.total}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Publicados</p>
          <p className="text-2xl font-bold text-green-400">{counts.published}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Borradores</p>
          <p className="text-2xl font-bold text-yellow-100">{counts.draft}</p>
        </div>
      </div>

      <AllCoursesTable
        courses={courses}
        token={token}
        onUpdate={() => fetchCourses(filters, false)}
        onEdit={() => { }}
        filters={{
          search: filters.search,
          status: filters.status,
          categoryId: filters.categoryId,
          instructorId: filters.instructorId,
        }}
        onFiltersChange={(newFilters) => {
          setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1,
          }));
        }}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
      />

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

