"use client";

import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useDeleteCategoryModal } from "./hooks/useDeleteCategoryModal";
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
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10">
      <div className="w-11/12 max-w-3xl rounded-lg border border-richblack-400 bg-richblack-800 p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <FiTrash2 className="text-xl text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-richblack-5">
                Eliminar Categoría
              </h2>
              <p className="text-sm text-richblack-400 mt-1">{category.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-richblack-400 hover:text-richblack-5 transition-colors"
            disabled={isProcessing}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-richblack-700/50 rounded-lg p-8 text-center">
              <FiRefreshCw className="animate-spin text-2xl text-richblack-400 mx-auto mb-2" />
              <p className="text-richblack-300">Cargando información...</p>
            </div>
          ) : hasCourses ? (
            <>
              {/* Advertencia */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-400 font-bold text-lg">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-semibold mb-1">
                      Esta categoría tiene {courses.length} curso(s) asociado(s)
                    </p>
                    <p className="text-sm text-richblack-300">
                      Para eliminar esta categoría, primero debes mover o eliminar
                      todos los cursos asociados.
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
            </>
          ) : (
            /* Sin cursos - Puede eliminar */
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
                <div>
                  <p className="text-green-400 font-semibold mb-1">
                    Esta categoría no tiene cursos asociados
                  </p>
                  <p className="text-sm text-richblack-300">
                    Puedes eliminar esta categoría de forma segura. Esta acción es
                    irreversible.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-richblack-700">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium disabled:opacity-50"
          >
            {hasCourses ? "Cerrar" : "Cancelar"}
          </button>
          {!hasCourses && (
            <button
              onClick={handleDeleteCategory}
              disabled={isProcessing}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processingCourse === "category" ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <FiTrash2 />
                  Eliminar Categoría
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
