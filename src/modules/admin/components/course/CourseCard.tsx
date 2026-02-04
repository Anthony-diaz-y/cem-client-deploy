"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminCourse } from "@shared/services/adminAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import { Img } from "@shared/components";
import {
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiStar,
  FiXCircle,
  FiEye,
} from "react-icons/fi";

interface CourseCardProps {
  course: AdminCourse;
  onPublishClick: (course: AdminCourse) => void;
  onUnpublishClick: (course: AdminCourse) => void;
  onDeleteClick: (course: AdminCourse) => void;
}

/**
 * Componente de tarjeta individual para mostrar información de un curso
 * Incluye acciones según el estado del curso (publicado/borrador)
 */
export default function CourseCard({
  course,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}: CourseCardProps) {
  const router = useRouter();

  return (
    <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 flex flex-col">
      {/* Thumbnail con badge de estado */}
      <div className="relative w-full h-48 bg-richblack-900 overflow-hidden">
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
            {course.status === COURSE_STATUS.DRAFT ? "Borrador" : "Publicado"}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Título y categoría */}
        <h3 className="text-lg font-bold text-richblack-5 line-clamp-2 min-h-[56px] mb-2">
          {course.courseName}
        </h3>
        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray(course.category) ? (
            course.category.map((cat: any) => (
              <span
                key={cat.id || cat.name}
                className="inline-flex px-3 py-1.5 text-xs font-medium rounded-md bg-richblack-700 text-richblack-300"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="inline-flex px-3 py-1.5 text-xs font-medium rounded-md bg-richblack-700 text-richblack-300">
              {/* Fallback for safety if backend sends single object temporarily */}
              {(course.category as any)?.name || "Sin categoría"}
            </span>
          )}
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-richblack-400 text-sm font-medium flex-shrink-0">
            {course.instructor?.name?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-richblack-5 truncate">
              {course.instructor?.name}
            </p>
            <p className="text-xs text-richblack-400 truncate">
              {course.instructor?.email}
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
          <span className="font-medium">
            {course.totalStudentsEnrolled || 0} estudiantes
          </span>
          {course.averageRating && (
            <span className="text-xs">
              {course.averageRating.toFixed(1)} ⭐
            </span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="pt-4 mt-auto space-y-2">
          {/* Botón Ver Detalles - siempre visible */}
          <button
            onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}
            className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <FiEye className="text-base" />
            Ver Detalles
          </button>

          {course.status === COURSE_STATUS.DRAFT ? (
            // Cursos en Borrador: Editar, Publicar, Eliminar
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/admin/courses/edit/${course.id}`)
                  }
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <FiEdit2 className="text-base" />
                  Editar
                </button>
                <button
                  onClick={() => onPublishClick(course)}
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <FiCheckCircle className="text-base" />
                  Publicar
                </button>
              </div>
              <button
                onClick={() => onDeleteClick(course)}
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
                    router.push(`/dashboard/admin/courses/edit/${course.id}`)
                  }
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <FiEdit2 className="text-base" />
                  Editar
                </button>
                <button
                  onClick={() => onUnpublishClick(course)}
                  className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20"
                >
                  <FiXCircle className="text-base" />
                  Despublicar
                </button>
              </div>
              <button
                onClick={() => onDeleteClick(course)}
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
  );
}
