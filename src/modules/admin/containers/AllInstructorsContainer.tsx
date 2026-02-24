"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import Pagination from "@shared/components/common/Pagination";
import { useAdminInstructors } from "../hooks/instructor/useAdminInstructors";
import { StatCard } from "../components/shared/StatCard";
import CreateInstructorModal from "../components/instructor/CreateInstructorModal";
import UserManagementTable from "../components/shared/UserManagementTable";
import { toggleInstructorStatus } from "@shared/services/adminAPI";
import { AdminHeader } from "../components/shared/AdminHeader";
import { AdminSearchBar } from "../components/shared/AdminSearchBar";

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

  const [showLoader, setShowLoader] = useState(false);

  // Mostrar loader solo si la carga tarda más de 300ms (evita parpadeo)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShowLoader(true), 300);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (!token) {
    return (
      <div className="text-center text-cem-neutral-gray-600 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <AdminHeader
        title="Gestión de Instructores"
        description="Administra todos los instructores del sistema. Filtra, busca, edita información, activa/desactiva cuentas y gestiona sus estados de manera completa."
        actionLabel="Nuevo Instructor"
        onAction={() => setIsCreateModalOpen(true)}
      />

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
        <div className="p-8 pb-0">
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

            <AdminSearchBar
              value={searchInput}
              onChange={setSearchInput}
              label="Buscar instructor por nombre o email..."
              isSearching={searching}
              className="w-full md:w-[50%]"
            />
          </div>
        </div>

        <div className="min-h-[823px] border-t border-cem-neutral-gray-100 flex flex-col relative">
          {showLoader && !searching ? (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center animate-fadeIn">
              <div className="w-12 h-12 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black text-cem-neutral-gray-400 uppercase tracking-widest">Sincronizando instructores...</p>
            </div>
          ) : null}

          <div className={`p-[23px] flex-1 flex flex-col transition-opacity duration-300 ${showLoader && !searching ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <UserManagementTable
              users={instructors}
              userLabel="Docente"
              basePath="/dashboard/admin/instructors"
              token={token}
              onUpdate={refreshInstructors}
              onToggleStatus={toggleInstructorStatus}
              showValidationColumn={true}
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

      <CreateInstructorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshInstructors}
        token={token}
      />
    </div>
  );
}
