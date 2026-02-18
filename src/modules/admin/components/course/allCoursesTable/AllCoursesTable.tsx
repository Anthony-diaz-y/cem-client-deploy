import React from "react";
import VirtualCourseCard from "./components/VirtualCourseCard";
import { AdminCourse } from "@shared/services/adminAPI";
import { useAllCoursesTable } from "./hooks/useAllCoursesTable";
import { ConfirmationModal } from "@shared/components";
import CourseFilters from "./components/CourseFilters";

interface AllCoursesTableProps {
  courses: AdminCourse[];
  token: string;
  onUpdate: () => void;
  filters?: {
    search?: string;
    status?: string;
    categoryId?: string;
    instructorId?: string;
  };
  onFiltersChange?: (filters: {
    search?: string;
    status?: string;
    categoryId?: string;
    instructorId?: string;
  }) => void;
  searchInput?: string;
  onSearchInputChange?: (value: string) => void;
  loadMore?: () => void;
  hasMore?: boolean;
  onEdit?: (course: AdminCourse) => void;
}

export default function AllCoursesTable(props: AllCoursesTableProps) {
  const {
    observerTarget,
    displayCourses,
    categories,
    instructors,
    statusFilter,
    categoryFilter,
    instructorFilter,
    searchInput,
    handlers: {
      handleStatusChange,
      handleCategoryChange,
      handleInstructorChange,
      handleSearchChange,
      handlePublishClick,
      handleUnpublishClick,
      handleDeleteClick,
      handleConfirm,
      closeConfirmationModal,
    },
    confirmationModal,
  } = useAllCoursesTable(props);

  return (
    <div className="space-y-6">
      <CourseFilters
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        instructorFilter={instructorFilter}
        searchQuery={searchInput}
        categories={categories}
        instructors={instructors}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onInstructorChange={handleInstructorChange}
        onSearchChange={handleSearchChange}
      />

      <div className="text-sm text-cem-neutral-gray-500 font-medium">
        Mostrando <span className="text-cem-primary font-bold">{displayCourses.length}</span> de
        <span className="text-cem-neutral-gray-900 font-bold">{props.courses.length}</span> curso{props.courses.length !== 1 ? "s" : ""}
      </div>

      {displayCourses.length === 0 ? (
        <div className="bg-cem-neutral-gray-50/50 rounded-2xl border border-cem-neutral-gray-100 p-16 text-center shadow-sm">
          <p className="text-cem-neutral-gray-400 text-lg font-medium">
            {props.courses.length === 0
              ? "No hay cursos en el sistema"
              : "No se encontraron cursos con los filtros seleccionados"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayCourses.map((course) => (
              <VirtualCourseCard
                key={course.id}
                course={course}
                onPublishClick={handlePublishClick}
                onUnpublishClick={handleUnpublishClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

          <div ref={observerTarget} className="h-20 w-full flex items-center justify-center pt-8">
            {props.hasMore && (
              <div className="flex items-center gap-2 text-cem-primary font-bold animate-pulse">
                <div className="w-2 h-2 rounded-full bg-cem-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cem-primary animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-cem-primary animate-bounce delay-200" />
                Cargando más cursos...
              </div>
            )}
          </div>
        </>
      )}

      {confirmationModal.isOpen && confirmationModal.course && (
        <ConfirmationModal
          modalData={{
            text1:
              confirmationModal.type === "publish"
                ? `¿Estás seguro de que deseas publicar el curso "${confirmationModal.course.courseName}"?`
                : confirmationModal.type === "unpublish"
                  ? `¿Estás seguro de que deseas despublicar el curso "${confirmationModal.course.courseName}"?`
                  : `¿Estás seguro de que deseas eliminar el curso "${confirmationModal.course.courseName}"?`,
            text2:
              confirmationModal.type === "publish"
                ? "El curso quedará disponible para los estudiantes después de la publicación."
                : confirmationModal.type === "unpublish"
                  ? "El curso volverá al estado de borrador y no estará disponible para los estudiantes."
                  : "Esta acción es irreversible. El curso será eliminado permanentemente.",
            btn1Text:
              confirmationModal.type === "publish"
                ? "Publicar"
                : confirmationModal.type === "unpublish"
                  ? "Despublicar"
                  : "Eliminar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: closeConfirmationModal,
          }}
        />
      )}
    </div>
  );
}
