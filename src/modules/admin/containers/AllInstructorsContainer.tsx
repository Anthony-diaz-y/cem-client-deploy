"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@shared/store/hooks";
import AllInstructorsTable from "../components/instructor/AllInstructorsTable";
import { getAllInstructors, InstructorFilters, Instructor } from "@shared/services/adminAPI";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import { FiSearch } from "react-icons/fi";

export default function AllInstructorsContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<InstructorFilters>({
    status: "all",
    active: undefined,
    search: "",
  });
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    active: 0,
    inactive: 0,
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
      // Siempre usar modo silencioso para cambios de filtros (sin toast)
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
      }
    } catch (error) {
      // Error manejado por el servicio
      setInstructors([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [token]);

  // Debounce para la búsqueda
  useEffect(() => {
    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Si el campo de búsqueda está vacío o solo tiene espacios, limpiar el filtro
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch === "") {
      setFilters((prev) => ({ ...prev, search: "" }));
      return;
    }

    // Configurar un nuevo timer para el debounce (500ms)
    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: trimmedSearch }));
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  // Efecto para cargar instructores cuando cambian los filtros
  useEffect(() => {
    if (!token) return;
    
    // Solo mostrar loading completo en la carga inicial
    // Todos los cambios de filtros serán silenciosos (sin toast, sin loading completo)
    const showLoading = isInitialMount.current;
    
    fetchInstructors(filters, showLoading);
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [token, filters.status, filters.active, filters.search, fetchInstructors]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          Gestión de Instructores
        </h1>
        <p className="text-richblack-400">
          Administra todos los instructores del sistema. Filtra, busca, edita información, activa/desactiva cuentas y gestiona sus estados de manera completa.
        </p>
      </div>

      {/* Contadores de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-richblack-5">{counts.total}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Aprobados</p>
          <p className="text-2xl font-bold text-green-400">{counts.approved}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{counts.pending}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por estado de aprobación */}
          <CustomDropdown
            label="Estado de Aprobación"
            value={filters.status || "all"}
            onChange={(value) =>
              setFilters({ ...filters, status: value as "approved" | "pending" | "all" })
            }
            options={[
              { value: "all", label: "Todos" },
              { value: "approved", label: "Aprobados" },
              { value: "pending", label: "Pendientes" },
            ]}
            placeholder="Seleccionar estado"
          />

          {/* Filtro por estado activo */}
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
              });
            }}
            options={[
              { value: "all", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
            placeholder="Seleccionar estado"
          />

          {/* Búsqueda */}
          <div className="relative">
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Buscar instructor
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

      {/* Tabla de instructores */}
      <AllInstructorsTable
        instructors={instructors}
        token={token}
        onUpdate={() => fetchInstructors(filters, true)}
      />
    </div>
  );
}

