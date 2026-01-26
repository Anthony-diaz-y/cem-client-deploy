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

      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomDropdown
            label="Estado de Aprobación"
            value={filters.status || "all"}
            onChange={(value) => handleStatusChange(value as "approved" | "pending" | "all")}
            options={[
              { value: "all", label: "Todos" },
              { value: "approved", label: "Aprobados" },
              { value: "pending", label: "Pendientes" },
            ]}
            placeholder="Seleccionar estado"
          />

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
              { value: "all", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
            placeholder="Seleccionar estado"
          />

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

      {loading && !searching ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <AllInstructorsTable
            instructors={instructors}
            token={token}
            onUpdate={refreshInstructors}
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
