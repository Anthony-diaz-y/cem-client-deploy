"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { getAllStudents, StudentFilters, Student, toggleStudentStatus } from "@shared/services/admin/students";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import Pagination from "@shared/components/common/Pagination";
import UserManagementTable from "../components/shared/UserManagementTable";
import { StatCard } from "../components/shared/StatCard";
import { AdminHeader } from "../components/shared/AdminHeader";
import { AdminSearchBar } from "../components/shared/AdminSearchBar";

export default function AllStudentsContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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

  const fetchStudents = useCallback(async (currentFilters: StudentFilters, silent = false) => {
    if (!token) return;

    if (!silent) setLoading(true);
    if (!silent) { // Only set searching if not silent
      setSearching(true);
    }
    try {
      const response = await getAllStudents(token, currentFilters, silent);
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

  // Efecto para manejar el retraso del loader (evitar parpadeo en cargas rápidas)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      // Solo mostrar el loader si la carga dura más de 300ms
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 300);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

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
    <div className="space-y-8 animate-fadeIn">
      <AdminHeader
        title="Gestión de Estudiantes"
        description="Administra todos los estudiantes del sistema. Filtra, busca, edita información y administra sus estados de manera integral."
      />

      {/* Grid de estadísticas - Distribución uniforme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Registrados", value: counts.total },
          { title: "Estudiantes Activos", value: counts.active },
          { title: "Cuentas Inactivas", value: counts.inactive },
        ].map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            height={119}
            className="w-full"
          />
        ))}
      </div>

      {/* Contenedor Único: Filtros + Tabla */}
      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 pb-0">
          <h2 className="text-2xl font-medium text-cem-neutral-gray-900 mb-6">
            Estudiantes
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
            <div className="flex-1 w-full">
              <CustomDropdown
                label="Estado de la Cuenta"
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
                    page: 1,
                  });
                }}
                options={[
                  { value: "all", label: "Todos los perfiles" },
                  { value: "true", label: "Solo Activos" },
                  { value: "false", label: "Solo Inactivos" },
                ]}
                placeholder="Estado"
              />
            </div>

            <AdminSearchBar
              value={searchInput}
              onChange={setSearchInput}
              label="Buscar estudiante por nombre o email..."
              isSearching={searching}
              className="w-full md:w-[50%]"
            />
          </div>
        </div>

        <div className="min-h-[823px] border-t border-cem-neutral-gray-100 flex flex-col relative">
          {showLoader && !searching ? (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center animate-fadeIn">
              <div className="w-12 h-12 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black text-cem-neutral-gray-400 uppercase tracking-widest">Sincronizando estudiantes...</p>
            </div>
          ) : null}

          <div className={`p-[23px] flex-1 flex flex-col transition-opacity duration-300 ${showLoader && !searching ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <UserManagementTable
              users={students}
              userLabel="Alumno"
              basePath="/dashboard/admin/students"
              token={token}
              onUpdate={() => fetchStudents(filters, true)}
              onToggleStatus={(id, status, token) => toggleStudentStatus(id, token)}
              showValidationColumn={false}
              hideContainerBorder={true}
            />

            <div className="mt-auto flex justify-center py-8">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
