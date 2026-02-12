"use client";

import React, { useState, useEffect, useRef } from "react";
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
import VirtualCourseCard from "./VirtualCourseCard";
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
  loadMore?: () => void;
  hasMore?: boolean;
}

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export default function AllCoursesTable({
  courses,
  token,
  onUpdate,
  filters,
  onFiltersChange,
  searchInput: externalSearchInput,
  onSearchInputChange,
  loadMore,
  hasMore,
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

  const observerTarget = useRef(null);

  useEffect(() => {
    if (!loadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "800px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore]);

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
      } catch {
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
        <div className="text-sm text-cem-neutral-gray-500 font-medium">
          Mostrando <span className="text-cem-primary font-bold">{displayCourses.length}</span> de <span className="text-cem-neutral-gray-900 font-bold">{courses.length}</span> curso{courses.length !== 1 ? "s" : ""}
          {shouldFilterLocally && ` de ${courses.length} total`}
        </div>

        {/* Grid de cursos */}
        {displayCourses.length === 0 ? (
          <div className="bg-cem-neutral-gray-50/50 rounded-2xl border border-cem-neutral-gray-100 p-16 text-center shadow-sm">
            <p className="text-cem-neutral-gray-400 text-lg font-medium">
              {courses.length === 0
                ? "No hay cursos en el sistema"
                : "No se encontraron cursos con los filtros seleccionados"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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

            {/* Sentinel element for infinite scroll */}
            <div
              ref={observerTarget}
              className="h-20 w-full flex items-center justify-center pt-8"
            >
              {hasMore && (
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
