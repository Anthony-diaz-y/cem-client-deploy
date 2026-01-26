"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { Loading } from "@shared/components";
import Pagination from "@shared/components/common/Pagination";
import ClassStatisticsCards from "../components/scheduled-classes/ClassStatisticsCards";
import AdminClassFilters from "../components/scheduled-classes/AdminClassFilters";
import AdminClassCard from "../components/scheduled-classes/AdminClassCard";
import EditClassForm from "@/modules/scheduled-classes/components/forms/EditClassForm";
import CreateClassForm from "@/modules/scheduled-classes/components/forms/CreateClassForm";
import { ConfirmationModal } from "@shared/components";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminClasses } from "../hooks/useAdminClasses";
import { useClassModals } from "@/modules/scheduled-classes/hooks/useClassModals";

/**
 * AllScheduledClassesContainer - Container component for Admin Classes Management
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
export default function AllScheduledClassesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);

  // Custom hooks for data fetching and business logic
  const {
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
  } = useAdminClasses(token);

  const {
    claseSeleccionada,
    editModalAbierto,
    deleteModal,
    handleEdit,
    handleDelete,
    handleToggleActive: handleToggleActiveFromHook,
    confirmDelete: confirmDeleteFromHook,
    closeEditModal,
    closeDeleteModal,
  } = useClassModals(user);

  // Wrapper para handleToggleActive que adapta la firma del componente AdminClassCard
  const handleToggleActiveWrapper = useCallback(async (classId: string, isActive: boolean) => {
    if (!token) return;
    await handleToggleActiveFromHook(classId, isActive, token, user?.accountType, refreshClasses);
  }, [token, user?.accountType, refreshClasses, handleToggleActiveFromHook]);

  // Wrapper para handleEdit que adapta la firma del componente AdminClassCard
  const handleEditWrapper = useCallback((classId: string) => {
    handleEdit(classId, classes);
  }, [classes, handleEdit]);

  // Wrapper para confirmDelete que adapta la firma del modal
  const confirmDeleteWrapper = useCallback(async () => {
    await confirmDeleteFromHook(token, user?.accountType, refreshClasses);
  }, [token, user?.accountType, refreshClasses, confirmDeleteFromHook]);

  const startIndex = useMemo(() => (meta.page - 1) * meta.limit + 1, [meta.page, meta.limit]);
  const endIndex = useMemo(() => Math.min(meta.page * meta.limit, meta.total), [meta.page, meta.limit, meta.total]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          📊 Panel de Administración - Clases Programadas
        </h1>
        <p className="text-richblack-400">
          Gestiona todas las clases programadas del sistema
        </p>
      </div>

      <ClassStatisticsCards statistics={statistics} />

      <AdminClassFilters
        onSearch={handleSearch}
        onPlatformChange={handlePlatformChange}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onInstructorChange={handleInstructorChange}
        onCreatedByChange={handleCreatedByChange}
        onClearFilters={handleClearFilters}
        initialSearch={filters.search}
        initialPlatform={filters.platform || 'all'}
        initialStatus={filters.isActive === undefined ? null : filters.isActive}
        initialDate={filters.startDate || null}
        initialCreatedBy={filters.createdBy}
        initialInstructor={filters.instructorId || 'all'}
        instructors={creators}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-richblack-5">
            📋 Lista de Clases
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-richblack-400">
              Mostrando {startIndex}-{endIndex} de {meta.total} clases
            </p>
            <button
              onClick={() => setMostrarFormularioCrear(!mostrarFormularioCrear)}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
            >
              {mostrarFormularioCrear ? '✕ Cancelar' : '➕ Crear Nueva Clase'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mostrarFormularioCrear && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-richblack-800 rounded-lg shadow-lg p-6 border border-richblack-700"
            >
              <h2 className="text-2xl font-bold text-richblack-5 mb-6">Nueva Clase Programada</h2>
              <CreateClassForm
                token={token}
                userRole={user?.accountType || 'Admin'}
                onSuccess={() => {
                  setMostrarFormularioCrear(false);
                  refreshClasses();
                }}
                onCancel={() => setMostrarFormularioCrear(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isFiltering && classes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-richblack-400">Buscando clases...</span>
          </div>
        ) : !initialLoading && !isFiltering && classes.length === 0 ? (
          <div className="bg-richblack-800 rounded-xl p-12 border border-richblack-700 text-center">
            <p className="text-richblack-400 text-lg mb-2">
              No se encontraron clases con los filtros seleccionados
            </p>
            <p className="text-richblack-500 text-sm">
              Intenta ajustar los filtros o limpiarlos para ver más resultados
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 transition-opacity duration-200 ${isFiltering ? 'opacity-60' : 'opacity-100'}`}>
            {classes.map((clase) => (
              <AdminClassCard
                key={clase.id}
                clase={clase}
                onToggleActive={handleToggleActiveWrapper}
                onEdit={handleEditWrapper}
                onDelete={handleDelete}
                token={token}
              />
            ))}
          </div>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {editModalAbierto && claseSeleccionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-richblack-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-richblack-700">
            <h2 className="text-2xl font-bold mb-6 text-richblack-5">Editar Clase</h2>
            <EditClassForm
              clase={claseSeleccionada}
              token={token}
              userRole="Admin"
              onSuccess={() => {
                closeEditModal();
                refreshClasses();
              }}
              onCancel={closeEditModal}
            />
          </div>
        </div>
      )}

      {deleteModal.isOpen && deleteModal.classId && (
        <ConfirmationModal
          modalData={{
            text1: "¿Estás seguro de que deseas eliminar esta clase?",
            text2: "Esta acción no se puede deshacer. Todos los datos de la clase se perderán permanentemente.",
            btn1Text: "Eliminar",
            btn2Text: "Cancelar",
            btn1Handler: confirmDeleteWrapper,
            btn2Handler: closeDeleteModal,
          }}
        />
      )}
    </div>
  );
}
