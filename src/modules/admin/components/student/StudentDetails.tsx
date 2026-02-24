"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { StatCard } from "../shared/StatCard";

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
  const fetchDetails = useCallback(async () => {
    if (!token || !studentId || studentId === "undefined") return;
    setLoading(true);
    try {
      const data = await getStudentDetails(studentId, token);
      if (data) {
        setStudent(data.student);
        setStatistics(data.statistics);
        setCourses(data.enrolledCourses);
      }
    } catch {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  }, [studentId, token]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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
      <div className="space-y-8 animate-fadeIn">
        {/* Botón volver */}
        <button
          onClick={() => router.push("/dashboard/admin/students")}
          className="flex items-center gap-2 text-cem-neutral-gray-400 hover:text-cem-primary transition-all group w-fit"
        >
          <div className="p-2 rounded-full group-hover:bg-cem-primary/10 transition-all">
            <FiArrowLeft size={20} />
          </div>
          <span className="font-bold text-sm tracking-wide">Volver a la lista</span>
        </button>

        {/* Header del estudiante */}
        <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative">
              <Img
                src={
                  student.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${student.name}`
                }
                alt={`${student.name}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white ${student.active ? "bg-green-500" : "bg-cem-neutral-gray-300"
                  }`}
              ></div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-cem-neutral-gray-900 tracking-tight">
                  {student.name}
                </h1>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold ${student.active
                      ? "bg-cem-primary/10 text-cem-primary"
                      : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"
                      }`}
                  >
                    {student.active ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
              </div>
              <p className="text-cem-neutral-gray-500 font-medium mb-6">
                {student.email}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm bg-cem-neutral-gray-50/50 p-6 rounded-2xl border border-cem-neutral-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                    <FiCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                      Miembro desde
                    </p>
                    <p className="font-bold text-cem-neutral-gray-700">
                      {formatDate(student.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                    <FiCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                      ID Estudiante
                    </p>
                    <p className="font-bold text-cem-neutral-gray-700 font-mono">
                      #{student.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                {(student.contactNumber || student.additionalDetails?.contactNumber) && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                      <FiCheckCircle size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                        Contacto
                      </p>
                      <p className="font-bold text-cem-neutral-gray-700">
                        {student.contactNumber || student.additionalDetails?.contactNumber}
                      </p>
                    </div>
                  </div>
                )}
                {student.additionalDetails?.gender && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                      <FiCheckCircle size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                        Género
                      </p>
                      <p className="font-bold text-cem-neutral-gray-700">
                        {student.additionalDetails.gender}
                      </p>
                    </div>
                  </div>
                )}
                {student.additionalDetails?.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                      <FiCheckCircle size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                        F. de Nacimiento
                      </p>
                      <p className="font-bold text-cem-neutral-gray-700">
                        {formatDate(student.additionalDetails.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                )}
                {student.additionalDetails?.about && (
                  <div className="col-span-full pt-4 border-t border-cem-neutral-gray-100 mt-2">
                    <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider mb-2">
                      Acerca de mí
                    </p>
                    <p className="text-cem-neutral-gray-600 leading-relaxed italic">
                      &quot;{student.additionalDetails.about}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/admin/students/${studentId}/edit`,
                  )
                }
                className="px-6 py-3 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-cem-primary/20"
              >
                <FiEdit size={18} />
                Editar Perfil
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${student.active
                  ? "border-red-100 text-red-500 hover:bg-red-50"
                  : "border-green-100 text-green-500 hover:bg-green-50"
                  }`}
              >
                {student.active ? (
                  <>
                    <FiXCircle size={18} />
                    Desactivar Cuenta
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={18} />
                    Activar Cuenta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Cursos Inscritos"
            value={statistics.enrolledCourses}
            height={119}
            className="w-full"
          />
          <StatCard
            title="Cursos Completados"
            value={statistics.completedCourses}
            height={119}
            className="w-full"
          />
          <StatCard
            title="Progreso Promedio"
            value={Number(statistics.averageProgress.toFixed(1))}
            height={119}
            className="w-full"
          />
        </div>

        {/* Lista de cursos (Inscritos) */}
        <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="px-8 py-6 border-b border-cem-neutral-gray-100 bg-cem-neutral-gray-50/50 flex justify-between items-center">
            <h2 className="text-2xl font-medium text-cem-neutral-gray-900">
              Cursos Inscritos{" "}
              <span className="text-cem-neutral-gray-400 font-normal">
                ({courses.length})
              </span>
            </h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-cem-neutral-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-3xl text-cem-neutral-gray-200" />
              </div>
              <p className="text-cem-neutral-gray-900 text-xl font-bold mb-1">
                Este estudiante no tiene cursos inscritos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cem-neutral-gray-50/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest w-[40%]">
                      Curso
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest w-[15%]">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest w-[15%]">
                      Fecha de Inscripción
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest w-[20%]">
                      Progreso
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest text-right w-[10%]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cem-neutral-gray-50">
                  {courses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-cem-neutral-gray-50/20 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-start gap-4">
                          <div className="relative h-[60px] w-[100px] flex-shrink-0 rounded-lg overflow-hidden border border-cem-neutral-gray-100">
                            <Img
                              src={course.thumbnail}
                              alt={course.courseName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-cem-neutral-gray-800 mb-1 line-clamp-2">
                              {course.courseName}
                            </p>
                            <p className="text-[10px] text-cem-neutral-gray-400 font-medium uppercase font-mono tracking-tighter">
                              ID: {course.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cem-neutral-gray-50 text-cem-neutral-gray-500 border border-cem-neutral-gray-100">
                          {course.category?.name || "Sin categoría"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-cem-neutral-gray-700">
                        {formatDate(course.enrolledAt)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-cem-neutral-gray-700">
                              {course.progressPercentage}%
                            </span>
                            <span className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-tighter">
                              {course.completed ? "COMPLETADO" : "EN CURSO"}
                            </span>
                          </div>
                          <div className="w-full bg-cem-neutral-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${course.progressPercentage === 100
                                ? "bg-cem-primary"
                                : "bg-cem-primary/40"
                                }`}
                              style={{ width: `${course.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-lg ${course.completed
                            ? "bg-green-50 text-green-500"
                            : "bg-cem-primary/10 text-cem-primary"
                            }`}
                        >
                          {course.completed ? "COMPLETADO" : "ACTIVO"}
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
              ? `¿Estás seguro de desactivar a ${student.name}?`
              : `¿Estás seguro de activar a ${student.name}?`,
            text2: student.active
              ? "El estudiante no podrá iniciar sesión hasta que sea activado nuevamente."
              : "El estudiante podrá iniciar sesión después de la activación.",
            btn1Text: student.active ? "Desactivar" : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () => setConfirmationModal({ isOpen: false }),
          }}
        />
      )}
    </>
  );
}
