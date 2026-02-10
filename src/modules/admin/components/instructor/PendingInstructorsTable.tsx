"use client";

import React, { useState } from "react";
import { Instructor } from "@shared/services/adminAPI";
import { approveInstructor, rejectInstructor } from "@shared/services/adminAPI";
import { Img, ConfirmationModal } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";

interface PendingInstructorsTableProps {
  instructors: Instructor[];
  token: string;
  onUpdate: () => void;
}

/**
 * Tabla para mostrar instructores pendientes de aprobación
 * Permite aprobar o rechazar solicitudes de instructores
 */
export default function PendingInstructorsTable({
  instructors,
  token,
  onUpdate,
}: PendingInstructorsTableProps) {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    instructor: Instructor | null;
  }>({
    isOpen: false,
    type: null,
    instructor: null,
  });

  // Abre el modal de confirmación para aprobar
  const handleApproveClick = (instructor: Instructor) => {
    setConfirmationModal({
      isOpen: true,
      type: "approve",
      instructor,
    });
  };

  // Abre el modal de confirmación para rechazar
  const handleRejectClick = (instructor: Instructor) => {
    setConfirmationModal({
      isOpen: true,
      type: "reject",
      instructor,
    });
  };

  // Ejecuta la acción confirmada (aprobar o rechazar)
  const handleConfirm = async () => {
    if (!confirmationModal.instructor) return;

    const success =
      confirmationModal.type === "approve"
        ? await approveInstructor(confirmationModal.instructor.id, token)
        : await rejectInstructor(confirmationModal.instructor.id, token);

    if (success) {
      setConfirmationModal({ isOpen: false, type: null, instructor: null });
      onUpdate();
    }
  };

  if (instructors.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-cem-neutral-gray-100 text-center shadow-sm">
        <div className="bg-cem-celeste-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-cem-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-cem-neutral-gray-800 text-xl font-bold">
          Todo al día
        </p>
        <p className="text-cem-neutral-gray-500 mt-2">
          No hay instructores pendientes de aprobación en este momento.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-8 py-6 border-b border-cem-neutral-gray-100 bg-cem-neutral-gray-50/30">
          <h2 className="text-xl font-extrabold text-cem-neutral-gray-900">
            Solicitudes Recientes
          </h2>
          <p className="text-sm text-cem-neutral-gray-500 font-medium mt-1">
            Tienes {instructors.length}{" "}
            {instructors.length === 1 ? "instructor" : "instructores"} esperando
            tu validación.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cem-neutral-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-cem-neutral-gray-500 uppercase tracking-widest border-b border-cem-neutral-gray-100">
                  Instructor
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-cem-neutral-gray-500 uppercase tracking-widest border-b border-cem-neutral-gray-100">
                  Email
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-cem-neutral-gray-500 uppercase tracking-widest border-b border-cem-neutral-gray-100">
                  Registro
                </th>
                <th className="px-8 py-4 text-right text-xs font-bold text-cem-neutral-gray-500 uppercase tracking-widest border-b border-cem-neutral-gray-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cem-neutral-gray-100">
              {instructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="hover:bg-cem-celeste-light/30 transition-colors group"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Img
                          src={
                            instructor.image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.name}`
                          }
                          alt={`${instructor.name}`}
                          className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-2 ring-white"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors">
                          {instructor.name}
                        </p>
                        <p className="text-xs text-cem-neutral-gray-400">
                          ID: {instructor.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <p className="text-sm text-cem-neutral-gray-600 font-medium">
                      {instructor.email}
                    </p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <p className="text-sm text-cem-neutral-gray-600 font-medium">
                      {formatDate(instructor.createdAt)}
                    </p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleApproveClick(instructor)}
                        className="px-5 py-2 bg-cem-primary text-white rounded-xl hover:bg-cem-primary-dark transition-all text-sm font-bold shadow-sm hover:shadow-cem-primary/20"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectClick(instructor)}
                        className="px-5 py-2 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all text-sm font-bold"
                      >
                        Rechazar
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
          modalData={
            confirmationModal.instructor
              ? {
                text1:
                  confirmationModal.type === "approve"
                    ? `¿Estás seguro de que deseas aprobar a ${confirmationModal.instructor.name}?`
                    : `¿Estás seguro de que deseas rechazar a ${confirmationModal.instructor.name}?`,
                text2:
                  confirmationModal.type === "approve"
                    ? "El instructor podrá iniciar sesión y crear cursos después de la aprobación."
                    : "El instructor no podrá iniciar sesión hasta que sea aprobado nuevamente.",
                btn1Text:
                  confirmationModal.type === "approve"
                    ? "Aprobar"
                    : "Rechazar",
                btn2Text: "Cancelar",
                btn1Handler: handleConfirm,
                btn2Handler: () =>
                  setConfirmationModal({
                    isOpen: false,
                    type: null,
                    instructor: null,
                  }),
              }
              : null
          }
        />
      )}
    </>
  );
}
