"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AdminCourse,
  publishCourse,
  deleteCourseAdmin,
  editCourseAdmin,
} from "@shared/services/adminAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { ConfirmationModal } from "@shared/components";
import CourseFilters from "./CourseFilters";
import CourseCard from "./CourseCard";
import { useCourseFilters } from "../../hooks/course/useCourseFilters";

interface AllCoursesTableProps {
  courses: AdminCourse[];
  token: string;
  onUpdate: () => void;
  onEdit: (course: AdminCourse) => void;
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
}

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

/**
 * Componente principal para mostrar y gestionar todos los cursos
 * Incluye filtros, búsqueda y acciones de publicación/eliminación
 */
export default function AllCoursesTable({
  courses,
  token,
  onUpdate,
  filters,
  onFiltersChange,
  searchInput: externalSearchInput,
  onSearchInputChange,
}: AllCoursesTableProps) {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "publish" | "unpublish" | "delete" | null;
    course: AdminCourse | null;
  }>({
    isOpen: false,
    type: null,
    course: null,
  });

  // Usar filtros externos si están disponibles, sino usar estado local
  const [localStatusFilter, setLocalStatusFilter] = useState<
    "all" | "Draft" | "Published"
  >("all");
  const [localCategoryFilter, setLocalCategoryFilter] = useState<string>("all");
  const [localInstructorFilter, setLocalInstructorFilter] = useState<string>("all");
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");

  // Validar que el statusFilter sea uno de los valores permitidos
  const statusFilter: "all" | "Draft" | "Published" =
    (filters?.status && (filters.status === "all" || filters.status === "Draft" || filters.status === "Published"))
      ? filters.status
      : localStatusFilter;
  const categoryFilter = filters?.categoryId || localCategoryFilter;
  const instructorFilter = filters?.instructorId || localInstructorFilter;
  const searchQuery = filters?.search || localSearchQuery;
  const searchInput = externalSearchInput !== undefined ? externalSearchInput : localSearchQuery;

  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Obtiene todas las categorías desde la API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCourseCategories();
        if (categories && Array.isArray(categories)) {
          setAllCategories(categories);
        }
      } catch (error) {
        // Error manejado por el servicio
      }
    };

    loadCategories();
  }, []);

  const hasBackendFilters = filters && (
    (filters.search !== undefined && filters.search !== null && filters.search.trim() !== "") ||
    (filters.status !== undefined && filters.status !== null && filters.status !== "all") ||
    (filters.categoryId !== undefined && filters.categoryId !== null && filters.categoryId !== "all") ||
    (filters.instructorId !== undefined && filters.instructorId !== null && filters.instructorId !== "all")
  );
  const shouldFilterLocally = !hasBackendFilters;

  // Usar el hook solo para obtener categorías e instructores únicos, no para filtrar
  const { filteredCourses, categories, instructors } = useCourseFilters(
    courses,
    shouldFilterLocally ? statusFilter : "all",
    shouldFilterLocally ? categoryFilter : "all",
    shouldFilterLocally ? instructorFilter : "all",
    shouldFilterLocally ? searchQuery : "",
    allCategories
  );

  const displayCourses = hasBackendFilters ? courses : filteredCourses;

  const handleStatusChange = (value: "all" | "Draft" | "Published") => {
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        status: value,
      };
      onFiltersChange(newFilters);
    } else {
      setLocalStatusFilter(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        categoryId: value,
      };
      onFiltersChange(newFilters);
    } else {
      setLocalCategoryFilter(value);
    }
  };

  const handleInstructorChange = (value: string) => {
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        instructorId: value,
      };
      onFiltersChange(newFilters);
    } else {
      setLocalInstructorFilter(value);
    }
  };

  const handleSearchChange = (value: string) => {
    if (onSearchInputChange) {
      onSearchInputChange(value);
    } else {
      setLocalSearchQuery(value);
    }
  };

  // Maneja el click en publicar
  const handlePublishClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "publish",
      course,
    });
  };

  // Maneja el click en despublicar
  const handleUnpublishClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "unpublish",
      course,
    });
  };

  // Maneja el click en eliminar
  const handleDeleteClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      course,
    });
  };

  // Confirma y ejecuta la acción seleccionada
  const handleConfirm = async () => {
    if (!confirmationModal.course) return;

    let success = false;
    if (confirmationModal.type === "publish") {
      success = await publishCourse(confirmationModal.course.id, token);
    } else if (confirmationModal.type === "unpublish") {
      // Cambiar el status a Draft usando editCourseAdmin
      const result = await editCourseAdmin(
        confirmationModal.course.id,
        { status: COURSE_STATUS.DRAFT },
        token
      );
      success = result !== null;
    } else if (confirmationModal.type === "delete") {
      success = await deleteCourseAdmin(confirmationModal.course.id, token);
    }

    if (success) {
      setConfirmationModal({ isOpen: false, type: null, course: null });
      onUpdate();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Filtros y búsqueda */}
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

        {/* Cantidad de cursos */}
        <div className="text-sm text-richblack-400">
          {displayCourses.length} curso{displayCourses.length !== 1 ? "s" : ""} encontrado{displayCourses.length !== 1 ? "s" : ""}
          {shouldFilterLocally && ` de ${courses.length} total`}
        </div>

        {/* Grid de cursos */}
        {displayCourses.length === 0 ? (
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-12 text-center">
            <p className="text-richblack-400 text-lg">
              {courses.length === 0
                ? "No hay cursos en el sistema"
                : "No se encontraron cursos con los filtros seleccionados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPublishClick={handlePublishClick}
                onUnpublishClick={handleUnpublishClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
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
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, type: null, course: null }),
          }}
        />
      )}
    </>
  );
}
