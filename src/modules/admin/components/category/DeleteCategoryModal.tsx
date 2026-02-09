"use client";

import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useDeleteCategoryModal } from "../../hooks/category/useDeleteCategoryModal";
import CourseList from "./components/CourseList";
import QuickActions from "./components/QuickActions";
import DeleteAllCoursesModal from "./DeleteAllCoursesModal";
import DeleteCourseModal from "./DeleteCourseModal";
import type { CategoryModalProps } from "./types";

/**
 * Modal simplificado para eliminar categorías
 * Interfaz intuitiva y profesional para gestionar cursos asociados
 */
export default function DeleteCategoryModal({
  isOpen,
  category,
  token,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const {
    courses,
    loading,
    otherCategories,
    processingCourse,
    courseCategoryMap,
    setCourseCategoryMap,
    selectedCategoryForAll,
    setSelectedCategoryForAll,
    showDeleteAllModal,
    setShowDeleteAllModal,
    deleteCourseModal,
    setDeleteCourseModal,
    handleChangeCourseCategory,
    handleDeleteCourseClick,
    handleDeleteCourse,
    handleMoveAllCourses,
    handleDeleteCategory,
    handleDeleteAllCourses,
  } = useDeleteCategoryModal({
    category,
    token,
    onSuccess,
    onClose,
  });

  if (!isOpen || !category) return null;

  const hasCourses = courses.length > 0;
  const hasOtherCategories = otherCategories.length > 0;
  const isProcessing = processingCourse !== null;

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-cem-neutral-gray-900/40 backdrop-blur-sm p-4">
      <div className="w-11/12 max-w-3xl rounded-[2.5rem] border border-cem-neutral-gray-100 bg-white p-8 my-8 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm">
              <FiTrash2 className="text-2xl text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-cem-neutral-gray-900 leading-tight">
                Eliminar Categoría
              </h2>
              <p className="text-sm text-cem-neutral-gray-500 font-bold uppercase tracking-widest mt-0.5">{category.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-cem-neutral-gray-400 hover:bg-cem-neutral-gray-50 hover:text-cem-neutral-gray-900 transition-all border border-transparent hover:border-cem-neutral-gray-100"
            disabled={isProcessing}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-8">
          {loading ? (
            <div className="bg-cem-neutral-gray-50/50 rounded-2xl p-12 text-center border border-cem-neutral-gray-100 border-dashed">
              <FiRefreshCw className="animate-spin text-3xl text-cem-primary mx-auto mb-4" />
              <p className="text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-widest">Cargando información segura...</p>
            </div>
          ) : hasCourses ? (
            <>
              {/* Advertencia */}
              <div className="bg-yellow-400/5 border-l-4 border-l-yellow-400 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0 text-richblack-900 shadow-lg shadow-yellow-400/20">
                    <span className="font-black text-xl">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-700 font-black text-lg mb-1">
                      Acción requerida: {courses.length} curso(s) detectado(s)
                    </p>
                    <p className="text-sm text-yellow-600 font-medium leading-relaxed">
                      Para eliminar esta categoría, primero debes reubicar o dar de baja
                      todos los cursos asociados para evitar pérdida de datos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              {hasOtherCategories && courses.length > 1 && (
                <QuickActions
                  coursesCount={courses.length}
                  otherCategories={otherCategories}
                  selectedCategoryForAll={selectedCategoryForAll}
                  isProcessing={isProcessing}
                  processingCourse={processingCourse}
                  onCategorySelect={setSelectedCategoryForAll}
                  onMoveAll={handleMoveAllCourses}
                  onDeleteAll={() => setShowDeleteAllModal(true)}
                />
              )}

              {/* Lista de cursos */}
              <div className="mt-6">
                <CourseList
                  courses={courses}
                  otherCategories={otherCategories}
                  courseCategoryMap={courseCategoryMap}
                  processingCourse={processingCourse}
                  isProcessing={isProcessing}
                  onCategoryChange={(courseId, categoryId) => {
                    setCourseCategoryMap((prev) => ({
                      ...prev,
                      [courseId]: categoryId,
                    }));
                  }}
                  onMoveCourse={handleChangeCourseCategory}
                  onDeleteCourse={handleDeleteCourseClick}
                />
              </div>
            </>
          ) : (
            /* Sin cursos - Puede eliminar */
            <div className="bg-caribbeangreen-400/5 border-l-4 border-l-caribbeangreen-400 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-caribbeangreen-400 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-caribbeangreen-400/20">
                  <span className="font-black text-xl">✓</span>
                </div>
                <div>
                  <p className="text-caribbeangreen-600 font-black text-lg mb-1">
                    Categoría lista para eliminación
                  </p>
                  <p className="text-sm text-caribbeangreen-600/80 font-medium leading-relaxed">
                    Esta categoría está vacía. Puedes proceder con su eliminación permanente del sistema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-end gap-4 mt-8 pt-8 border-t border-cem-neutral-gray-100">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 md:flex-none px-8 py-4 bg-white text-cem-neutral-gray-500 border border-cem-neutral-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cem-neutral-gray-50 transition-all disabled:opacity-50"
          >
            {hasCourses ? "Entendido" : "Cancelar"}
          </button>
          {!hasCourses && (
            <button
              onClick={handleDeleteCategory}
              disabled={isProcessing}
              className="flex-1 md:flex-none px-10 py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
            >
              {processingCourse === "category" ? (
                <>
                  <FiRefreshCw className="animate-spin text-lg" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <FiTrash2 className="text-lg" />
                  Confirmar Eliminación
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar todos los cursos */}
      <DeleteAllCoursesModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        categoryName={category.name}
        coursesCount={courses.length}
        onConfirm={handleDeleteAllCourses}
      />

      {/* Modal de confirmación para eliminar un curso individual */}
      <DeleteCourseModal
        isOpen={deleteCourseModal.isOpen}
        onClose={() =>
          setDeleteCourseModal({ isOpen: false, courseId: null, courseName: "" })
        }
        courseName={deleteCourseModal.courseName}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
}
