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
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-cem-neutral-gray-900 tracking-tight">
          Gestión de Estudiantes
        </h1>
        <p className="text-cem-neutral-gray-600 font-medium max-w-3xl leading-relaxed">
          Administra todos los estudiantes del sistema. Filtra, busca, edita información y administra sus estados de manera integral.
        </p>
      </div>

      {/* Contadores de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Registrados", value: counts.total, color: "text-cem-neutral-gray-900", bg: "bg-white", border: "border-cem-neutral-gray-100" },
          { label: "Estudiantes Activos", value: counts.active, color: "text-caribbeangreen-400", bg: "bg-white", border: "border-caribbeangreen-100" },
          { label: "Cuentas Inactivas", value: counts.inactive, color: "text-cem-neutral-gray-400", bg: "bg-white", border: "border-cem-neutral-gray-100" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bg} ${stat.border} rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all group`}
          >
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-cem-neutral-gray-600 transition-colors">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color} tracking-tight`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-4">
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

          <div className="md:col-span-8 relative">
            <label className="block text-[10px] font-black text-cem-neutral-gray-900 uppercase tracking-widest mb-2.5 ml-1">
              Buscar estudiante por nombre o email
            </label>
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cem-neutral-gray-400 group-focus-within:text-cem-primary transition-colors" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nombre, correo electrónico, ID de registro..."
                className="w-full pl-12 pr-12 py-4 bg-cem-neutral-gray-50/50 border border-cem-neutral-gray-100 rounded-2xl text-cem-neutral-gray-900 font-bold placeholder-cem-neutral-gray-300 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-3 border-cem-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && !searching ? (
        <div className="h-[400px] flex flex-col items-center justify-center animate-pulse">
          <div className="w-12 h-12 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-black text-cem-neutral-gray-400 uppercase tracking-widest">Sincronizando estudiantes...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-slideUp">
          <AllStudentsTable
            students={students}
            token={token}
            onUpdate={() => fetchStudents(filters, true)}
          />

          <div className="flex justify-center pb-8">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
