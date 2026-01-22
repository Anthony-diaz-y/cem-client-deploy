"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@shared/store/hooks";
import AllStudentsTable from "../components/student/AllStudentsTable";
import { getAllStudents, StudentFilters, Student } from "@shared/services/admin/students";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import { FiSearch } from "react-icons/fi";

import Pagination from "@shared/components/common/Pagination";

export default function AllStudentsContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<StudentFilters>({
    active: undefined,
    search: "",
    page: 1,
    limit: 10,
  });
  const [counts, setCounts] = useState({
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const fetchStudents = useCallback(async (currentFilters: StudentFilters, showLoading = true) => {
    if (!token) return;
    if (showLoading) {
      setLoading(true);
    } else {
      setSearching(true);
    }
    try {
      const response = await getAllStudents(token, currentFilters, true);
      if (response && response.success) {
        setStudents(response.data.all || []);
        setCounts({
          total: response.counts?.total || 0,
          active: response.counts?.active || 0,
          inactive: response.counts?.inactive || 0,
        });
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (error) {
      setStudents([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [token]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Debounce para la búsqueda - reducido para búsqueda más inmediata
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

  // Efecto para cargar estudiantes cuando cambian los filtros
  useEffect(() => {
    if (!token) return;

    const showLoading = isInitialMount.current || filters.page !== meta.page;

    fetchStudents(filters, showLoading);

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [token, filters, fetchStudents]);

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
          Gestión de Estudiantes
        </h1>
        <p className="text-richblack-400">
          Administra todos los estudiantes del sistema. Filtra, busca, edita información y administra sus estados.
        </p>
      </div>

      {/* Contadores de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-richblack-5">{counts.total}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-400">{counts.active}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Inactivos</p>
          <p className="text-2xl font-bold text-gray-400">{counts.inactive}</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDropdown
            label="Estado Activo"
            value={
              filters.active === undefined
                ? "all"
                : filters.active
                  ? "true"
                  : "false"
            }
            onChange={(value) => {
              setFilters({
                ...filters,
                active: value === "all" ? undefined : value === "true",
                page: 1, // Reset to page 1 on filter change
              });
            }}
            options={[
              { value: "all", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
            placeholder="Seleccionar estado"
          />

          <div className="relative">
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Buscar estudiante
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-10 py-2 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:border-richblack-600 transition-colors"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && !searching ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <AllStudentsTable
            students={students}
            token={token}
            onUpdate={() => fetchStudents(filters, true)}
          />

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
