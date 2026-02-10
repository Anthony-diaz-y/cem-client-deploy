"use client";

import { useAppSelector } from "@shared/store/hooks";
import AllInstructorsTable from "../components/instructor/AllInstructorsTable";
import { Loading } from "@shared/components";
import CustomDropdown from "../components/dropdown/CustomDropdown";
import { FiSearch } from "react-icons/fi";
import Pagination from "@shared/components/common/Pagination";
import { useAdminInstructors } from "../hooks/instructor/useAdminInstructors";

export default function AllInstructorsContainer() {
  const { token } = useAppSelector((state) => state.auth);
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
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-cem-neutral-gray-900 tracking-tight">
          Gestión de Instructores
        </h1>
        <p className="text-cem-neutral-gray-600 font-medium max-w-3xl leading-relaxed">
          Administra todos los instructores del sistema. Filtra, busca, edita información, activa/desactiva cuentas y gestiona sus estados de manera completa.
        </p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", value: counts.total, color: "text-cem-neutral-gray-900", bg: "bg-white", border: "border-cem-neutral-gray-100" },
          { label: "Aprobados", value: counts.approved, color: "text-caribbeangreen-400", bg: "bg-white", border: "border-caribbeangreen-100" },
          { label: "Pendientes", value: counts.pending, color: "text-cem-primary", bg: "bg-white", border: "border-cem-primary/20", highlight: true },
          { label: "Activos", value: counts.active, color: "text-caribbeangreen-400", bg: "bg-white", border: "border-caribbeangreen-100" },
          { label: "Inactivos", value: counts.inactive, color: "text-cem-neutral-gray-400", bg: "bg-white", border: "border-cem-neutral-gray-100" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bg} ${stat.border} rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all group ${stat.highlight ? "ring-2 ring-cem-primary/10" : ""}`}
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

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-3">
            <CustomDropdown
              label="Estado de Aprobación"
              value={filters.status || "all"}
              onChange={(value) => handleStatusChange(value as "approved" | "pending" | "all")}
              options={[
                { value: "all", label: "Cualquier estado" },
                { value: "approved", label: "Aprobados" },
                { value: "pending", label: "Pendientes" },
              ]}
              placeholder="Estado"
            />
          </div>

          <div className="md:col-span-3">
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
                handleActiveChange(value === "all" ? undefined : value === "true");
              }}
              options={[
                { value: "all", label: "Activos e Inactivos" },
                { value: "true", label: "Activos" },
                { value: "false", label: "Inactivos" },
              ]}
              placeholder="Actividad"
            />
          </div>

          <div className="md:col-span-6 relative">
            <label className="block text-[10px] font-black text-cem-neutral-gray-900 uppercase tracking-widest mb-2.5 ml-1">
              Buscar instructor por nombre o email
            </label>
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cem-neutral-gray-400 group-focus-within:text-cem-primary transition-colors" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nombre, correo electrónico, ID..."
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
          <p className="text-xs font-black text-cem-neutral-gray-400 uppercase tracking-widest">Sincronizando instructores...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-slideUp">
          <AllInstructorsTable
            instructors={instructors}
            token={token}
            onUpdate={refreshInstructors}
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
