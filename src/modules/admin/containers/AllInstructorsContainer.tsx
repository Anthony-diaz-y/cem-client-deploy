"use client";

import React, { useState } from "react";
import { useAppSelector } from "@shared/store/hooks";
import AllInstructorsTable from "../components/instructor/AllInstructorsTable";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import { FiSearch, FiPlus } from "react-icons/fi";
import Pagination from "@shared/components/common/Pagination";
import { useAdminInstructors } from "../hooks/instructor/useAdminInstructors";
import { StatCard } from "../components/shared/StatCard";
import CreateInstructorModal from "../components/instructor/CreateInstructorModal";

export default function AllInstructorsContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
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
  } = useAdminInstructors(token);

  if (!token) {
    return (
      <div className="text-center text-cem-neutral-gray-600 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-cem-neutral-gray-900 tracking-tight">
            Gestión de Instructores
          </h1>
          <p className="text-cem-neutral-gray-600 font-medium max-w-3xl leading-relaxed">
            Administra todos los instructores del sistema. Filtra, busca, edita información, activa/desactiva cuentas y gestiona sus estados de manera completa.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 whitespace-nowrap h-fit"
        >
          <FiPlus className="text-xl" />
          <span>Nuevo Instructor</span>
        </button>
      </div>

      {/* Grid de estadísticas - Distribución uniforme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Total", value: counts.total },
          { title: "Aprobados", value: counts.approved },
          { title: "Pendientes", value: counts.pending },
          { title: "Activos", value: counts.active },
          { title: "Inactivos", value: counts.inactive },
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
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-medium text-cem-neutral-gray-900 mb-6">
            Instructores
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
            <div className="flex-1 w-full">
              <CustomDropdown
                label="Estado de aprobación"
                value={filters.status || "all"}
                onChange={(value) => handleStatusChange(value as "approved" | "pending" | "all")}
                options={[
                  { value: "all", label: "Todos" },
                  { value: "approved", label: "Aprobados" },
                  { value: "pending", label: "Pendientes" },
                ]}
                placeholder="Estado"
              />
            </div>

            <div className="flex-1 w-full">
              <CustomDropdown
                label="Actividad"
                value={
                  filters.active === undefined
                    ? "all"
                    : filters.active
                      ? "true"
                      : "false"
                }
                onChange={(value) => {
                  handleActiveChange(value === "all" ? undefined : value === "true");
                }}
                options={[
                  { value: "all", label: "Todos" },
                  { value: "true", label: "Activos" },
                  { value: "false", label: "Inactivos" },
                ]}
                placeholder="Actividad"
              />
            </div>

            <div className="w-full md:w-[424px] relative">
              <label className="text-[13px] font-bold text-cem-neutral-gray-700 mb-2 ml-1 block">
                Buscar instructor por nombre o email...
              </label>
              <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cem-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full h-14 pl-12 pr-12 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-lg text-sm font-semibold text-cem-neutral-gray-600 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
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
          <div className="h-[400px] flex flex-col items-center justify-center animate-pulse border-t border-cem-neutral-gray-100">
            <div className="w-12 h-12 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black text-cem-neutral-gray-400 uppercase tracking-widest">Sincronizando instructores...</p>
          </div>
        ) : (
          <div className="animate-slideUp p-[23px] border-cem-neutral-gray-100">
            <AllInstructorsTable
              instructors={instructors}
              token={token}
              onUpdate={refreshInstructors}
              hideContainerBorder={true} // Pasaremos este prop para evitar bordes dobles
            />

            <div className="flex justify-center py-8">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      <CreateInstructorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshInstructors}
        token={token}
      />
    </div>
  );
}
