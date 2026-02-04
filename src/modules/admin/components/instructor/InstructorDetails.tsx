"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getInstructorDetails,
  toggleInstructorStatus,
  InstructorStatistics,
  InstructorCourse,
  Instructor,
} from "@shared/services/adminAPI";
import { Img } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { ConfirmationModal, Loading } from "@shared/components";
import { FiArrowLeft, FiEdit, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface InstructorDetailsProps {
  instructorId: string;
  token: string;
  onUpdate?: () => void;
}

/**
 * Componente para mostrar los detalles completos de un instructor
 * Incluye información personal, estadísticas y lista de cursos
 */
export default function InstructorDetails({
  instructorId,
  token,
  onUpdate,
}: InstructorDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [statistics, setStatistics] = useState<InstructorStatistics | null>(
    null,
  );
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  useEffect(() => {
    fetchDetails();
  }, [instructorId, token]);

  // Carga los detalles del instructor desde la API
  const fetchDetails = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getInstructorDetails(instructorId, token);
      if (data) {
        setInstructor(data.instructor);
        setStatistics(data.statistics);
        setCourses(data.courses);
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  // Abre el modal de confirmación para cambiar estado activo/inactivo
  const handleToggleStatus = () => {
    if (!instructor) return;
    setConfirmationModal({
      isOpen: true,
    });
  };

  // Ejecuta la acción confirmada (cambiar estado)
  const handleConfirm = async () => {
    if (!instructor) return;

    const success = await toggleInstructorStatus(
      instructor.id,
      !instructor.active,
      token,
    );

    if (success) {
      setConfirmationModal({ isOpen: false });
      fetchDetails();
      if (onUpdate) onUpdate();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!instructor || !statistics) {
    return (
      <div className="text-center text-richblack-300 py-8">
        <p className="text-lg">Instructor no encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => router.push("/dashboard/admin/instructors")}
          className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>

        {/* Header del instructor */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
          <div className="flex items-start gap-6">
            <Img
              src={
                instructor.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.name}`
              }
              alt={`${instructor.name}`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                {instructor.name}
              </h1>
              <p className="text-richblack-300 mb-4">{instructor.email}</p>
              <div className="flex gap-3 mb-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    instructor.approved
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {instructor.approved ? "Aprobado" : "Pendiente"}
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    instructor.active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {instructor.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              {instructor.profile && (
                <div className="space-y-2 text-sm text-richblack-400">
                  {instructor.profile.gender && (
                    <p>Género: {instructor.profile.gender}</p>
                  )}
                  {instructor.profile.dateOfBirth && (
                    <p>
                      Fecha de Nacimiento:{" "}
                      {formatDate(instructor.profile.dateOfBirth)}
                    </p>
                  )}
                  {instructor.profile.contactNumber && (
                    <p>Contacto: {instructor.profile.contactNumber}</p>
                  )}
                  {instructor.profile.about && (
                    <p className="mt-2 text-richblack-300">
                      {instructor.profile.about}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/admin/instructors/${instructorId}/edit`,
                  )
                }
                className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors flex items-center gap-2"
              >
                <FiEdit size={18} />
                Editar
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  instructor.active
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {instructor.active ? (
                  <>
                    <FiXCircle size={18} />
                    Desactivar
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={18} />
                    Activar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Total de Cursos</p>
            <p className="text-3xl font-bold text-richblack-5">
              {statistics.totalCourses}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Cursos Publicados</p>
            <p className="text-3xl font-bold text-green-400">
              {statistics.publishedCourses}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">
              Cursos en Borrador
            </p>
            <p className="text-3xl font-bold text-yellow-400">
              {statistics.draftCourses}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">
              Total de Estudiantes
            </p>
            <p className="text-3xl font-bold text-blue-400">
              {statistics.totalStudents}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Ingresos Totales</p>
            <p className="text-3xl font-bold text-green-400">
              ${(statistics.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">
              Calificación Promedio
            </p>
            <p className="text-3xl font-bold text-yellow-400">
              ⭐ {(statistics.averageRating || 0).toFixed(1)}
            </p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Total de Reseñas</p>
            <p className="text-3xl font-bold text-purple-400">
              {statistics.totalReviews}
            </p>
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-richblack-700">
            <h2 className="text-xl font-semibold text-richblack-5">
              Cursos del Instructor ({courses.length})
            </h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-richblack-400">
                Este instructor no tiene cursos registrados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richblack-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Nombre del Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Estudiantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Calificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Reseñas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase">
                      Categoría
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-richblack-900/50">
                      <td className="px-6 py-4 text-sm font-medium text-richblack-5">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === "Published"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {course.status === "Published"
                            ? "Publicado"
                            : "Borrador"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        ${course.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        {course.totalStudents}
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        ${(course.revenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        ⭐ {(course.averageRating || 0).toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        {course.totalReviews}
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        {course.category?.name || "Sin categoría"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmationModal.isOpen && instructor && (
        <ConfirmationModal
          modalData={{
            text1: instructor.active
              ? `¿Estás seguro de desactivar a ${instructor.name}?`
              : `¿Estás seguro de activar a ${instructor.name}?`,
            text2: instructor.active
              ? "El instructor no podrá iniciar sesión hasta que sea activado nuevamente."
              : "El instructor podrá iniciar sesión después de la activación.",
            btn1Text: instructor.active ? "Desactivar" : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () => setConfirmationModal({ isOpen: false }),
          }}
        />
      )}
    </>
  );
}
