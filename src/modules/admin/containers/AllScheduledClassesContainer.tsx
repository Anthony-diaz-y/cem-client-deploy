"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { ClaseProgramada } from "@/types/scheduledClasses.types";
import { actualizarClaseProgramada, eliminarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";

/**
 * AllScheduledClassesContainer - Container component for Admin Classes Management
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
export default function AllScheduledClassesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
  
  // Estado local de las clases para actualizar sin recargar
  const [localClasses, setLocalClasses] = useState<ClaseProgramada[]>([]);

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

  // Sincronizar estado local cuando cambian las clases del hook
  useEffect(() => {
    setLocalClasses(classes);
  }, [classes]);

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
  // No recarga toda la página, solo actualiza el estado local del componente
  const handleToggleActiveWrapper = useCallback(async (classId: string, isActive: boolean) => {
    if (!token) return;
    
    try {
      // Actualizar el estado local inmediatamente para feedback visual
      setLocalClasses((prevClasses) =>
        prevClasses.map((clase) =>
          clase.id === classId ? { ...clase, isActive } : clase
        )
      );
      
      // Llamar al hook para actualizar en el backend
      await handleToggleActiveFromHook(classId, isActive, token, user?.accountType);
    } catch (error) {
      // Revertir el estado local si hay error
      setLocalClasses((prevClasses) =>
        prevClasses.map((clase) =>
          clase.id === classId ? { ...clase, isActive: !isActive } : clase
        )
      );
    }
  }, [token, user?.accountType, handleToggleActiveFromHook]);

  // Wrapper para handleEdit que adapta la firma del componente AdminClassCard
  // Usa localClasses para asegurar que se use la versión más actualizada
  const handleEditWrapper = useCallback((classId: string) => {
    handleEdit(classId, localClasses);
  }, [localClasses, handleEdit]);

  // Wrapper para confirmDelete que actualiza el estado local sin recargar
  const confirmDeleteWrapper = useCallback(async () => {
    if (!deleteModal.classId) return;
    
    try {
      await eliminarClaseProgramada(deleteModal.classId, token);
      
      // Remover la clase eliminada del estado local
      setLocalClasses((prevClasses) =>
        prevClasses.filter((clase) => clase.id !== deleteModal.classId)
      );
      
      toast.success("Clase eliminada exitosamente");
      closeDeleteModal();
      // No llamar a refreshClasses para evitar recargar toda la página
    } catch (error: unknown) {
      const mensaje =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al eliminar la clase";
      toast.error(mensaje);
    }
  }, [token, deleteModal.classId, closeDeleteModal]);

  // Handler para cuando se edita exitosamente una clase
  // Actualiza el estado local con la clase editada sin recargar toda la página
  const handleEditSuccess = useCallback((updatedClass?: ClaseProgramada) => {
    if (updatedClass) {
      // Actualizar solo la clase editada en el estado local
      setLocalClasses((prevClasses) =>
        prevClasses.map((clase) =>
          clase.id === updatedClass.id ? updatedClass : clase
        )
      );
      // También actualizar claseSeleccionada para que el modal muestre los datos actualizados si se vuelve a abrir
      // Esto se hace a través del hook, pero como no tenemos acceso directo, 
      // el handleEditWrapper ya usará localClasses que está actualizado
    } else {
      // Si no se proporciona la clase actualizada, refrescar los datos
      // pero solo después de un breve delay para asegurar que el backend haya procesado
      setTimeout(() => {
        refreshClasses();
      }, 100);
    }
    closeEditModal();
  }, [closeEditModal, refreshClasses]);

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
            {localClasses.map((clase) => (
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

      {editModalAbierto && claseSeleccionada && (() => {
        // Obtener la versión actualizada de la clase del estado local
        const claseActualizada = localClasses.find(c => c.id === claseSeleccionada.id) || claseSeleccionada;
        
        return (
          <div key={claseActualizada.id} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
            <div className="bg-richblack-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-richblack-700">
              <h2 className="text-2xl font-bold mb-6 text-richblack-5">Editar Clase</h2>
              <EditClassForm
                clase={claseActualizada}
                token={token}
                userRole="Admin"
                onSuccess={handleEditSuccess}
                onCancel={closeEditModal}
              />
            </div>
          </div>
        );
      })()}

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
