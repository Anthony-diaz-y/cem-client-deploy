"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCourse,
  publishCourse,
  deleteCourseAdmin,
  editCourseAdmin,
} from "@shared/services/adminAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import Img from "@shared/components/Img";
import ConfirmationModal from "@shared/components/ConfirmationModal";
import { FiEdit2, FiTrash2, FiCheckCircle, FiStar, FiXCircle } from "react-icons/fi";
import CustomDropdown from "./CustomDropdown";

interface AllCoursesTableProps {
  courses: AdminCourse[];
  token: string;
  onUpdate: () => void;
  onEdit: (course: AdminCourse) => void;
  onCreateCategory?: () => void;
  categoryRefreshKey?: number; // Key para forzar refresco de categorías
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
  onCreateCategory,
  categoryRefreshKey,
}: AllCoursesTableProps) {
  const router = useRouter();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "publish" | "unpublish" | "delete" | null;
    course: AdminCourse | null;
  }>({
    isOpen: false,
    type: null,
    course: null,
  });

  const [statusFilter, setStatusFilter] = useState<
    "all" | "Draft" | "Published"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [instructorFilter, setInstructorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Obtener todas las categorías desde la API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCourseCategories();
        if (categories && Array.isArray(categories)) {
          setAllCategories(categories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, [categoryRefreshKey]);

  // Obtener categorías únicas de los cursos (para mostrar cuáles tienen cursos)
  const categoriesFromCourses = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(
        courses.map((course) => [course.category.id, course.category])
      ).values()
    );
    return uniqueCategories;
  }, [courses]);

  // Usar todas las categorías de la API, no solo las de los cursos
  const categories =
    allCategories.length > 0 ? allCategories : categoriesFromCourses;

  // Obtener instructores únicos
  const instructors = useMemo(() => {
    const uniqueInstructors = Array.from(
      new Map(
        courses.map((course) => [course.instructor.id, course.instructor])
      ).values()
    );
    return uniqueInstructors;
  }, [courses]);

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Filtro por estado
      if (statusFilter !== "all" && course.status !== statusFilter) {
        return false;
      }

      // Filtro por categoría
      if (categoryFilter !== "all" && course.category.id !== categoryFilter) {
        return false;
      }

      // Filtro por instructor
      if (
        instructorFilter !== "all" &&
        course.instructor.id !== instructorFilter
      ) {
        return false;
      }

      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          course.courseName.toLowerCase().includes(query) ||
          course.courseDescription.toLowerCase().includes(query) ||
          `${course.instructor.firstName} ${course.instructor.lastName}`
            .toLowerCase()
            .includes(query)
        );
      }

      return true;
    });
  }, [courses, statusFilter, categoryFilter, instructorFilter, searchQuery]);

  const handlePublishClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "publish",
      course,
    });
  };

  const handleUnpublishClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "unpublish",
      course,
    });
  };

  const handleDeleteClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      course,
    });
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-richblack-5">
              Todos los Cursos
            </h2>
            <p className="text-sm text-richblack-400 mt-1">
              {filteredCourses.length} de {courses.length} cursos
            </p>
          </div>
          {/* Header con botón de crear categoría */}
          <div className="flex flex-col items-end gap-2">
            {onCreateCategory && (
              <button
                onClick={onCreateCategory}
                className="flex items-center gap-x-1 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
              >
                <span>+</span> Crear Categoría
              </button>
            )}
            {/* Header con botón de crear curso */}
            <button
              onClick={() => {
                router.push("/dashboard/add-course");
              }}
              className="flex items-center gap-x-1 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
            >
              <span>+</span> Crear Curso
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6 space-y-4">
          {/* Barra de búsqueda */}
          <div>
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Buscar curso
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de curso, descripción o instructor..."
              className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
            {/* Filtro por estado */}
            <CustomDropdown
              label="Estado"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as typeof statusFilter)
              }
              options={[
                { value: "all", label: "Todos" },
                { value: COURSE_STATUS.DRAFT, label: "Borrador" },
                { value: COURSE_STATUS.PUBLISHED, label: "Publicado" },
              ]}
              placeholder="Seleccionar estado"
            />

            {/* Filtro por categoría */}
            <CustomDropdown
              label="Categoría"
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              options={[
                { value: "all", label: "Todas" },
                ...categories.map((category) => {
                  const categoryId = category.id || "";
                  return {
                    value: categoryId,
                    label: category.name,
                  };
                }),
              ]}
              placeholder="Seleccionar categoría"
            />

            {/* Filtro por instructor */}
            <CustomDropdown
              label="Instructor"
              value={instructorFilter}
              onChange={(value) => setInstructorFilter(value)}
              options={[
                { value: "all", label: "Todos" },
                ...instructors.map((instructor) => ({
                  value: instructor.id,
                  label: `${instructor.firstName} ${instructor.lastName}`,
                })),
              ]}
              placeholder="Seleccionar instructor"
            />
          </div>
        </div>

        {/* Grid de cursos */}
        {filteredCourses.length === 0 ? (
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-12 text-center">
            <p className="text-richblack-400 text-lg">
              {courses.length === 0
                ? "No hay cursos en el sistema"
                : "No se encontraron cursos con los filtros seleccionados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 flex flex-col"
              >
                {/* Thumbnail con badge de estado */}
                <div className="relative w-full aspect-video bg-richblack-900">
                  {course.thumbnail ? (
                    <Img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-richblack-500">
                      Sin imagen
                    </div>
                  )}
                  {/* Badge de estado */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                        course.status === COURSE_STATUS.DRAFT
                          ? "bg-yellow-500/90 text-richblack-900"
                          : "bg-green-500/90 text-white"
                      }`}
                    >
                      {course.status === COURSE_STATUS.DRAFT
                        ? "Borrador"
                        : "Publicado"}
                    </span>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  {/* Título y categoría */}
                  <div>
                    <h3 className="text-xl font-semibold text-richblack-5 line-clamp-2 mb-3">
                      {course.courseName}
                    </h3>
                    <span className="inline-flex px-3 py-1.5 text-xs font-medium rounded-md bg-richblack-700 text-richblack-300">
                      {course.category.name}
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-richblack-400 text-sm font-medium flex-shrink-0">
                      {course.instructor.firstName[0]}
                      {course.instructor.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-richblack-5 truncate">
                        {course.instructor.firstName}{" "}
                        {course.instructor.lastName}
                      </p>
                      <p className="text-xs text-richblack-400 truncate">
                        {course.instructor.email}
                      </p>
                    </div>
                  </div>

                  {/* Precio y Rating */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-3xl font-bold text-yellow-50">
                      ${course.price.toFixed(2)}
                    </span>
                    {course.averageRating && (
                      <div className="flex items-center gap-1.5 text-richblack-400">
                        <FiStar className="text-yellow-500 fill-yellow-500 text-lg" />
                        <span className="text-sm font-semibold text-richblack-5">
                          {course.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-richblack-400">
                          ({course.totalReviews || 0})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div className="flex items-center justify-between text-sm text-richblack-400 pt-3 border-t border-richblack-700">
                    <span className="font-medium">{course.totalStudentsEnrolled || 0} estudiantes</span>
                    {course.averageRating && (
                      <span className="text-xs">{course.averageRating.toFixed(1)} ⭐</span>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="pt-4 mt-auto space-y-2">
                    {course.status === COURSE_STATUS.DRAFT ? (
                      // Cursos en Borrador: Editar, Publicar, Eliminar
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/courses/edit/${course.id}`
                              )
                            }
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20"
                          >
                            <FiEdit2 className="text-base" />
                            Editar
                          </button>
                          <button
                            onClick={() => handlePublishClick(course)}
                            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20"
                          >
                            <FiCheckCircle className="text-base" />
                            Publicar
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/20"
                        >
                          <FiTrash2 className="text-base" />
                          Eliminar
                        </button>
                      </>
                    ) : (
                      // Cursos Publicados: Editar, Despublicar, Eliminar
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/courses/edit/${course.id}`
                              )
                            }
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20"
                          >
                            <FiEdit2 className="text-base" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleUnpublishClick(course)}
                            className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20"
                          >
                            <FiXCircle className="text-base" />
                            Despublicar
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/20"
                        >
                          <FiTrash2 className="text-base" />
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
