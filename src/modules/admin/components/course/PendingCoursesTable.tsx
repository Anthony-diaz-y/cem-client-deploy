"use client";

import React, { useState } from "react";
import { AdminCourse, publishCourse, deleteCourseAdmin } from "@shared/services/adminAPI";
import { Img, ConfirmationModal } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { COURSE_STATUS } from "@shared/utils/constants";

interface PendingCoursesTableProps {
  courses: AdminCourse[];
  token: string;
  onUpdate: () => void;
  onEdit: (course: AdminCourse) => void;
}

/**
 * Tabla para mostrar cursos pendientes de publicación
 * Permite editar, publicar o eliminar cursos en estado borrador
 */
export default function PendingCoursesTable({
  courses,
  token,
  onUpdate,
  onEdit,
}: PendingCoursesTableProps) {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "publish" | "delete" | null;
    course: AdminCourse | null;
  }>({
    isOpen: false,
    type: null,
    course: null,
  });

  // Abre el modal de confirmación para publicar
  const handlePublishClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "publish",
      course,
    });
  };

  // Abre el modal de confirmación para eliminar
  const handleDeleteClick = (course: AdminCourse) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      course,
    });
  };

  // Ejecuta la acción confirmada (publicar o eliminar)
  const handleConfirm = async () => {
    if (!confirmationModal.course) return;

    let success = false;
    if (confirmationModal.type === "publish") {
      success = await publishCourse(confirmationModal.course.id, token);
    } else if (confirmationModal.type === "delete") {
      success = await deleteCourseAdmin(confirmationModal.course.id, token);
    }

    if (success) {
      setConfirmationModal({ isOpen: false, type: null, course: null });
      onUpdate();
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay cursos pendientes de publicación
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-richblack-700">
          <h2 className="text-xl font-semibold text-richblack-5">
            Cursos Pendientes de Publicación
          </h2>
          <p className="text-sm text-richblack-400 mt-1">
            {courses.length} {courses.length === 1 ? "curso" : "cursos"} esperando aprobación
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-richblack-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-richblack-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail && (
                        <Img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="h-16 w-28 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-richblack-5 truncate">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-richblack-400 mt-1 line-clamp-2">
                          {course.courseDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-richblack-5">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <p className="text-xs text-richblack-400">
                        {course.instructor.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {course.category.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-5 font-medium">
                      ${course.price.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {formatDate(course.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.status === COURSE_STATUS.DRAFT
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {course.status === COURSE_STATUS.DRAFT ? "Borrador" : "Publicado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(course)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handlePublishClick(course)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Publicar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmationModal.isOpen && confirmationModal.course && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.type === "publish"
              ? `¿Estás seguro de que deseas publicar el curso "${confirmationModal.course.courseName}"?`
              : `¿Estás seguro de que deseas eliminar el curso "${confirmationModal.course.courseName}"?`,
            text2: confirmationModal.type === "publish"
              ? "El curso quedará disponible para los estudiantes después de la publicación."
              : "Esta acción es irreversible. El curso será eliminado permanentemente.",
            btn1Text: confirmationModal.type === "publish" ? "Publicar" : "Eliminar",
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

