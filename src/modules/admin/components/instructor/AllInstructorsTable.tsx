"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Instructor, toggleInstructorStatus } from "@shared/services/adminAPI";
import { Img, ConfirmationModal } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { FiEye, FiEdit, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface AllInstructorsTableProps {
  instructors: Instructor[];
  token: string;
  onUpdate: () => void;
}

/**
 * Tabla para mostrar todos los instructores del sistema
 * Permite ver detalles, editar y activar/desactivar instructores
 */
export default function AllInstructorsTable({
  instructors,
  token,
  onUpdate,
}: AllInstructorsTableProps) {
  const router = useRouter();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    instructor: Instructor | null;
  }>({
    isOpen: false,
    instructor: null,
  });

  // Abre el modal de confirmación para cambiar estado activo/inactivo
  const handleToggleStatus = (instructor: Instructor) => {
    setConfirmationModal({
      isOpen: true,
      instructor,
    });
  };

  // Ejecuta la acción confirmada (cambiar estado)
  const handleConfirm = async () => {
    if (!confirmationModal.instructor) return;

    const newActiveStatus = !confirmationModal.instructor.active;
    const success = await toggleInstructorStatus(
      confirmationModal.instructor.id,
      newActiveStatus,
      token
    );

    if (success) {
      setConfirmationModal({ isOpen: false, instructor: null });
      onUpdate();
    }
  };

  if (instructors.length === 0) {
    return (
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay instructores registrados
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-richblack-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Estado Aprobación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Estado Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {instructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="hover:bg-richblack-900/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Img
                        src={
                          instructor.image ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                        }
                        alt={`${instructor.firstName} ${instructor.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-richblack-5">
                          {instructor.firstName} {instructor.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {instructor.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        instructor.approved
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {instructor.approved ? "Aprobado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        instructor.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {instructor.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {formatDate(instructor.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/instructors/${instructor.id}`
                          )
                        }
                        className="p-2 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                        title="Ver detalles"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/instructors/${instructor.id}/edit`
                          )
                        }
                        className="p-2 rounded-md bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(instructor)}
                        className={`p-2 rounded-md transition-colors ${
                          instructor.active
                            ? "bg-orange-600/20 text-orange-400 hover:bg-orange-600/30"
                            : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        }`}
                        title={instructor.active ? "Desactivar" : "Activar"}
                      >
                        {instructor.active ? (
                          <FiXCircle size={16} />
                        ) : (
                          <FiCheckCircle size={16} />
                        )}
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
      {confirmationModal.isOpen && confirmationModal.instructor && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.instructor.active
              ? `¿Estás seguro de desactivar a ${confirmationModal.instructor.firstName} ${confirmationModal.instructor.lastName}?`
              : `¿Estás seguro de activar a ${confirmationModal.instructor.firstName} ${confirmationModal.instructor.lastName}?`,
            text2: confirmationModal.instructor.active
              ? "El instructor no podrá iniciar sesión hasta que sea activado nuevamente."
              : "El instructor podrá iniciar sesión después de la activación.",
            btn1Text: confirmationModal.instructor.active
              ? "Desactivar"
              : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, instructor: null }),
          }}
        />
      )}
    </>
  );
}
