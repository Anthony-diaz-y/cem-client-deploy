"use client";

import { useState, useCallback } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { Loading } from "@shared/components";
import Pagination from "@shared/components/common/Pagination";
import ClassStatisticsCards from "@modules/admin/components/scheduled-classes/ClassStatisticsCards";
import InstructorClassFilters from "../components/filters/InstructorClassFilters";
import AdminClassCard from "@modules/admin/components/scheduled-classes/AdminClassCard";
import EditClassForm from "../components/forms/EditClassForm";
import CreateClassForm from "../components/forms/CreateClassForm";
import { ConfirmationModal } from "@shared/components";
import { motion, AnimatePresence } from "framer-motion";
import { useInstructorClasses } from "../hooks/useInstructorClasses";
import { useClassModals } from "../hooks/useClassModals";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

/**
 * InstructorClassesManagementContainer - Container component for Instructor Classes Management
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
export default function InstructorClassesManagementContainer() {
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
    handlePageChange,
    handleSearch,
    handlePlatformChange,
    handleStatusChange,
    handleCreatedByChange,
    handleDateChange,
    handleClearFilters,
    refreshClasses,
  } = useInstructorClasses(token);

  const {
    claseSeleccionada,
    editModalAbierto,
    deleteModal,
    canEdit,
    handleEdit,
    handleDelete,
    handleToggleActive: handleToggleActiveFromHook,
    confirmDelete,
    closeEditModal,
    closeDeleteModal,
  } = useClassModals(user);
  
  // Wrapper para handleToggleActive que adapta la firma del componente AdminClassCard
  const handleToggleActiveWrapper = useCallback(async (classId: string, isActive: boolean) => {
    if (!token) return;
    await handleToggleActiveFromHook(classId, isActive, token, user?.accountType, refreshClasses);
  }, [token, user?.accountType, refreshClasses, handleToggleActiveFromHook]);

  const startIndex = (meta.page - 1) * meta.limit + 1;
  const endIndex = Math.min(meta.page * meta.limit, meta.total);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.unauthorized}
      </div>
    );
  }

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-richblack-5">
            {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.title}
          </h1>
          <p className="text-richblack-400">
            {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.description}
          </p>
        </div>
        <button
          onClick={() => setMostrarFormularioCrear(!mostrarFormularioCrear)}
          className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
        >
          {mostrarFormularioCrear ? SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.buttons.cancel : SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.buttons.createNew}
        </button>
      </div>

      <AnimatePresence>
        {mostrarFormularioCrear && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-richblack-800 rounded-lg shadow-lg p-6 border border-richblack-700"
          >
            <h2 className="text-2xl font-bold text-richblack-5 mb-6">{SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.formTitle}</h2>
            <CreateClassForm
              token={token}
              userRole={user?.accountType || 'Instructor'}
              onSuccess={() => {
                setMostrarFormularioCrear(false);
                refreshClasses();
              }}
              onCancel={() => setMostrarFormularioCrear(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ClassStatisticsCards statistics={statistics} />

      <InstructorClassFilters
        onSearch={handleSearch}
        onPlatformChange={handlePlatformChange}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onCreatedByChange={handleCreatedByChange}
        onClearFilters={handleClearFilters}
        initialDate={filters.startDate || null}
        initialSearch={filters.search}
        initialPlatform={filters.platform || 'all'}
        initialStatus={filters.isActive === undefined ? null : filters.isActive}
        initialCreatedBy={filters.createdBy}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-richblack-5">
            {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.listTitle}
          </h2>
          <p className="text-sm text-richblack-400">
            {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.showing} {startIndex}-{endIndex} {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.of} {meta.total} {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.classes}
          </p>
        </div>

        {isFiltering && classes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-richblack-400">{SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.searching}</span>
          </div>
        ) : !initialLoading && !isFiltering && classes.length === 0 ? (
          <div className="bg-richblack-800 rounded-xl p-12 border border-richblack-700 text-center">
            <p className="text-richblack-400 text-lg mb-2">
              {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.noResults.message}
            </p>
            <p className="text-richblack-500 text-sm">
              {SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.noResults.suggestion}
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 transition-opacity duration-200 ${isFiltering ? 'opacity-60' : 'opacity-100'}`}>
            {classes.map((clase) => {
              const isAdmin = user?.accountType === 'Admin';
              const canEditClass = canEdit(clase);
              const handleToggleWrapper = isAdmin ? handleToggleActiveWrapper : undefined;
              return (
                <AdminClassCard
                  key={clase.id}
                  clase={clase}
                  onToggleActive={handleToggleWrapper}
                  onEdit={canEditClass ? (id) => handleEdit(id, classes) : undefined}
                  onDelete={isAdmin ? (id) => handleDelete(id) : undefined}
                  token={token}
                />
              );
            })}
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
            <h2 className="text-2xl font-bold mb-6 text-richblack-5">{SCHEDULED_CLASSES_TEXTS.containers.instructorClasses.editTitle}</h2>
            <EditClassForm
              clase={claseSeleccionada}
              token={token}
              userRole={user?.accountType || 'Instructor'}
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
            text1: SCHEDULED_CLASSES_TEXTS.modals.delete.title,
            text2: SCHEDULED_CLASSES_TEXTS.modals.delete.message,
            btn1Text: SCHEDULED_CLASSES_TEXTS.modals.delete.confirm,
            btn2Text: SCHEDULED_CLASSES_TEXTS.modals.delete.cancel,
            btn1Handler: () => confirmDelete(token, user?.accountType, refreshClasses),
            btn2Handler: closeDeleteModal,
          }}
        />
      )}
    </div>
  );
}
