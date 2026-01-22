"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStudentDetails,
  toggleStudentStatus,
  StudentStatistics,
  StudentCourse,
  Student,
} from "@shared/services/admin/students";
import { Img, ConfirmationModal, Loading } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { FiArrowLeft, FiEdit, FiCheckCircle, FiXCircle } from "react-icons/fi";
import EditStudentModal from "./EditStudentModal";

interface StudentDetailsProps {
  studentId: string;
  token: string;
  onUpdate?: () => void;
}

/**
 * Componente para mostrar los detalles completos de un estudiante
 */
export default function StudentDetails({
  studentId,
  token,
  onUpdate,
}: StudentDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  useEffect(() => {
    fetchDetails();
  }, [studentId, token]);

  const fetchDetails = async () => {
    if (!token || !studentId || studentId === "undefined") return;
    setLoading(true);
    try {
      const data = await getStudentDetails(studentId, token);
      if (data) {
        setStudent(data.student);
        setStatistics(data.statistics);
        setCourses(data.enrolledCourses);
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    if (!student) return;
    setConfirmationModal({
      isOpen: true,
    });
  };

  const handleConfirm = async () => {
    if (!student) return;

    const success = await toggleStudentStatus(student.id, token);

    if (success) {
      setConfirmationModal({ isOpen: false });
      fetchDetails();
      if (onUpdate) onUpdate();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!student || !statistics) {
    return (
      <div className="text-center text-richblack-300 py-8">
        <p className="text-lg">Estudiante no encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => router.push("/dashboard/admin/students")}
          className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>

        {/* Header del estudiante */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
          <div className="flex items-start gap-6">
            <Img
              src={student.image || `https://api.dicebear.com/5.x/initials/svg?seed=${student.firstName} ${student.lastName}`}
              alt={`${student.firstName} ${student.lastName}`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-richblack-300 mb-4">{student.email}</p>
              <div className="flex gap-3 mb-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${student.active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                    }`}
                >
                  {student.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="space-y-2 text-sm text-richblack-400">
                {student.additionalDetails?.gender && (
                  <p>Género: {student.additionalDetails.gender}</p>
                )}
                {student.additionalDetails?.dateOfBirth && (
                  <p>Fecha de Nacimiento: {formatDate(student.additionalDetails.dateOfBirth)}</p>
                )}
                {(student.contactNumber || student.additionalDetails?.contactNumber) && (
                  <p>Contacto: {student.contactNumber || student.additionalDetails?.contactNumber}</p>
                )}
                {student.additionalDetails?.about && (
                  <p className="mt-2 text-richblack-300">{student.additionalDetails.about}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditModal({ isOpen: true })}
                className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors flex items-center gap-2"
              >
                <FiEdit size={18} />
                Editar
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${student.active
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {student.active ? (
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
            <p className="text-sm text-richblack-400 mb-2">Cursos Inscritos</p>
            <p className="text-3xl font-bold text-richblack-5">{statistics.enrolledCourses}</p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Cursos Completados</p>
            <p className="text-3xl font-bold text-green-400">{statistics.completedCourses}</p>
          </div>
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
            <p className="text-sm text-richblack-400 mb-2">Progreso Promedio</p>
            <p className="text-3xl font-bold text-blue-400">
              {statistics.averageProgress.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Lista de cursos (Inscritos) */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-richblack-700">
            <h2 className="text-xl font-semibold text-richblack-5">
              Cursos Inscritos ({courses.length})
            </h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-richblack-400">Este estudiante no tiene cursos inscritos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richblack-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider w-[40%]">
                      Curso
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider w-[15%]">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider w-[15%]">
                      Fecha de Inscripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider w-[20%]">
                      Progreso
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider w-[10%]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-richblack-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="relative h-[60px] w-[100px] flex-shrink-0 rounded-lg overflow-hidden border border-richblack-700">
                            <Img
                              src={course.thumbnail}
                              alt={course.courseName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-richblack-5 mb-1 line-clamp-2">
                              {course.courseName}
                            </p>
                            <p className="text-xs text-richblack-400">ID: {course.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-300 border border-richblack-600">
                          {course.category?.name || "Sin categoría"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-richblack-300">
                        {formatDate(course.enrolledAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-medium text-richblack-300">{course.progressPercentage}%</span>
                            <span className="text-xs text-richblack-400">Completado</span>
                          </div>
                          <div className="w-full bg-richblack-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${course.progressPercentage === 100
                                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                  : "bg-gradient-to-r from-yellow-50 to-yellow-200"
                                }`}
                              style={{ width: `${course.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${course.completed
                            ? "bg-green-900/30 text-green-400 border-green-900"
                            : "bg-blue-900/30 text-blue-400 border-blue-900"
                            }`}
                        >
                          {course.completed ? "Completado" : "En curso"}
                        </span>
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
      {confirmationModal.isOpen && student && (
        <ConfirmationModal
          modalData={{
            text1: student.active
              ? `¿Estás seguro de desactivar a ${student.firstName} ${student.lastName}?`
              : `¿Estás seguro de activar a ${student.firstName} ${student.lastName}?`,
            text2: student.active
              ? "El estudiante no podrá iniciar sesión hasta que sea activado nuevamente."
              : "El estudiante podrá iniciar sesión después de la activación.",
            btn1Text: student.active ? "Desactivar" : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false }),
          }}
        />
      )}

      {/* Modal de Edición */}
      {editModal.isOpen && student && (
        <EditStudentModal
          isOpen={editModal.isOpen}
          student={student}
          token={token}
          onClose={() => setEditModal({ isOpen: false })}
          onUpdate={fetchDetails}
        />
      )}
    </>
  );
}
