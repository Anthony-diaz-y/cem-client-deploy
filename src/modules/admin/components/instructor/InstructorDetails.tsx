"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getInstructorDetails,
  toggleInstructorStatus,
  InstructorStatistics,
  InstructorCourse,
  Instructor,
} from "@shared/services/adminAPI";
import { Img } from "@shared/components";
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

  // Carga los detalles del instructor desde la API
  const fetchDetails = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getInstructorDetails(instructorId, token);
      if (data) {
        setInstructor(data.instructor);
        setStatistics(data.statistics);
        setCourses(data.courses);
      }
    } catch {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  }, [instructorId, token]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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
      <div className="space-y-8 animate-fadeIn">
        {/* Botón volver */}
        <button
          onClick={() => router.push("/dashboard/admin/instructors")}
          className="flex items-center gap-2 text-cem-neutral-gray-400 hover:text-cem-primary transition-all group w-fit"
        >
          <div className="p-2 rounded-full group-hover:bg-cem-primary/10 transition-all">
            <FiArrowLeft size={20} />
          </div>
          <span className="font-bold text-sm tracking-wide">Volver a la lista</span>
        </button>

        {/* Header del instructor */}
        <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative">
              <Img
                src={
                  instructor.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.name}`
                }
                alt={`${instructor.name}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white ${instructor.active ? "bg-green-500" : "bg-cem-neutral-gray-300"
                  }`}
              ></div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-cem-neutral-gray-900 tracking-tight">
                  {instructor.name}
                </h1>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold ${instructor.approved
                      ? "bg-cem-primary/10 text-cem-primary"
                      : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"
                      }`}
                  >
                    {instructor.approved ? "VERIFICADO" : "EN REVISIÓN"}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold ${instructor.active
                      ? "bg-cem-primary/10 text-cem-primary"
                      : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"
                      }`}
                  >
                    {instructor.active ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
              </div>
              <p className="text-cem-neutral-gray-500 font-medium mb-6">
                {instructor.email}
              </p>

              {instructor.profile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-cem-neutral-gray-50/50 p-6 rounded-2xl border border-cem-neutral-gray-100">
                  {instructor.profile.contactNumber && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                        <FiCheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                          Contacto
                        </p>
                        <p className="font-bold text-cem-neutral-gray-700">
                          {instructor.profile.contactNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {instructor.profile.gender && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white border border-cem-neutral-gray-100 flex items-center justify-center text-cem-primary shadow-sm">
                        <FiCheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider">
                          Género
                        </p>
                        <p className="font-bold text-cem-neutral-gray-700">
                          {instructor.profile.gender}
                        </p>
                      </div>
                    </div>
                  )}
                  {instructor.profile.professional_title && (
                    <div className="col-span-full pt-2 border-t border-cem-neutral-gray-100 mt-2">
                      <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider mb-2">
                        Especialidades (Experto en)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {instructor.profile.professional_title.split(",").map((spec, i) => (
                          <span key={i} className="px-3 py-1 bg-cem-primary/5 text-cem-primary rounded-lg text-xs font-bold border border-cem-primary/10">
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {instructor.profile.about && (
                    <div className="col-span-full pt-2 border-t border-cem-neutral-gray-100 mt-2">
                      <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-wider mb-2">
                        Biografía
                      </p>
                      <p className="text-cem-neutral-gray-600 leading-relaxed italic">
                        &quot;{instructor.profile.about}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/admin/instructors/${instructorId}/edit`,
                  )
                }
                className="px-6 py-3 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-cem-primary/20"
              >
                <FiEdit size={18} />
                Editar Perfil
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${instructor.active
                  ? "border-red-100 text-red-500 hover:bg-red-50"
                  : "border-green-100 text-green-500 hover:bg-green-50"
                  }`}
              >
                {instructor.active ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Cursos del Instructor",
              value: statistics.totalCourses,
            },
            {
              title: "Estudiantes Totales",
              value: statistics.totalStudents,
            },
            {
              title: "Ganancias Totales",
              value: `$${(statistics.totalRevenue || 0).toFixed(2)}`,
            },
            {
              title: "Calificación Promedio",
              value: `⭐ ${(statistics.averageRating || 0).toFixed(1)}`,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-[2rem] px-8 py-6 transition-all hover:shadow-md hover:-translate-y-1 shadow-sm flex flex-col justify-between bg-[#EBF9FF] border border-[#D0EFFF]"
            >
              <div>
                <p className="text-[12px] font-bold text-cem-neutral-gray-500 uppercase tracking-widest mb-3">
                  {stat.title}
                </p>
                <p className="text-3xl font-black text-cem-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de cursos */}
        <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="px-8 py-6 border-b border-cem-neutral-gray-100 bg-cem-neutral-gray-50/50 flex justify-between items-center">
            <h2 className="text-2xl font-medium text-cem-neutral-gray-900">
              Cursos Registrados{" "}
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
                Aún no tiene cursos
              </p>
              <p className="text-cem-neutral-gray-500 italic">
                Este instructor no ha creado ningún curso en la plataforma.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cem-neutral-gray-50/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      Curso
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      Estudiantes
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                      Ganancias
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest text-right">
                      Valoración
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
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-cem-neutral-gray-800 line-clamp-1">
                            {course.courseName}
                          </span>
                          <span className="text-[10px] text-cem-neutral-gray-400 font-medium">
                            {course.category?.name || "SIN CATEGORÍA"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-lg ${course.status === "Published"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"
                            }`}
                        >
                          {course.status === "Published"
                            ? "PUBLICADO"
                            : "BORRADOR"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-cem-neutral-gray-700">
                          ${course.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-cem-neutral-gray-700">
                            {course.totalStudents}
                          </span>
                          <div className="h-1 w-8 bg-cem-neutral-gray-100 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-cem-primary"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (course.totalStudents / 100) * 100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-cem-primary">
                          ${(course.revenue || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-cem-neutral-gray-700">
                              {(course.averageRating || 0).toFixed(1)}
                            </span>
                            <span className="text-orange-400">★</span>
                          </div>
                          <span className="text-[10px] text-cem-neutral-gray-400 font-medium whitespace-nowrap">
                            {course.totalReviews} reseñas
                          </span>
                        </div>
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
