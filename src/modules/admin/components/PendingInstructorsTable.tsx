"use client";

import React, { useState } from "react";
import { Instructor } from "@shared/services/adminAPI";
import { approveInstructor, rejectInstructor } from "@shared/services/adminAPI";
import Img from "@shared/components/Img";
import { formatDate } from "@shared/utils/formatDate";
import ConfirmationModal from "@shared/components/ConfirmationModal";

interface PendingInstructorsTableProps {
  instructors: Instructor[];
  token: string;
  onUpdate: () => void;
}

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

  const handleApproveClick = (instructor: Instructor) => {
    setConfirmationModal({
      isOpen: true,
      type: "approve",
      instructor,
    });
  };

  const handleRejectClick = (instructor: Instructor) => {
    setConfirmationModal({
      isOpen: true,
      type: "reject",
      instructor,
    });
  };

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
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay instructores pendientes de aprobación
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-richblack-700">
          <h2 className="text-xl font-semibold text-richblack-5">
            Instructores Pendientes de Aprobación
          </h2>
          <p className="text-sm text-richblack-400 mt-1">
            {instructors.length} {instructors.length === 1 ? "instructor" : "instructores"} esperando aprobación
          </p>
        </div>

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
                        src={instructor.image || `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`}
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
                    <p className="text-sm text-richblack-300">{instructor.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {formatDate(instructor.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApproveClick(instructor)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectClick(instructor)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
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

      {confirmationModal.isOpen && confirmationModal.instructor && (
        <ConfirmationModal
          modalData={confirmationModal.instructor ? {
            text1: confirmationModal.type === "approve"
              ? `¿Estás seguro de que deseas aprobar a ${confirmationModal.instructor.firstName} ${confirmationModal.instructor.lastName}?`
              : `¿Estás seguro de que deseas rechazar a ${confirmationModal.instructor.firstName} ${confirmationModal.instructor.lastName}?`,
            text2: confirmationModal.type === "approve"
              ? "El instructor podrá iniciar sesión y crear cursos después de la aprobación."
              : "El instructor no podrá iniciar sesión hasta que sea aprobado nuevamente.",
            btn1Text: confirmationModal.type === "approve" ? "Aprobar" : "Rechazar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, type: null, instructor: null }),
          } : null}
        />
      )}
    </>
  );
}

