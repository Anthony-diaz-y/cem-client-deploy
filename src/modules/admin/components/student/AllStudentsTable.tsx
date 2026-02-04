"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Student, toggleStudentStatus } from "@shared/services/admin/students";
import { Img, ConfirmationModal } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { FiEye, FiEdit, FiCheckCircle, FiXCircle } from "react-icons/fi";
import EditStudentModal from "./EditStudentModal";

interface AllStudentsTableProps {
  students: Student[];
  token: string;
  onUpdate: () => void;
}

/**
 * Tabla para mostrar todos los estudiantes del sistema
 * Permite ver detalles, editar y activar/desactivar estudiantes
 */
export default function AllStudentsTable({
  students,
  token,
  onUpdate,
}: AllStudentsTableProps) {
  const router = useRouter();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    student: Student | null;
  }>({
    isOpen: false,
    student: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    student: Student | null;
  }>({
    isOpen: false,
    student: null,
  });

  // Abre el modal de confirmación para cambiar estado activo/inactivo
  const handleToggleStatus = (student: Student) => {
    setConfirmationModal({
      isOpen: true,
      student,
    });
  };

  // Abre el modal de edición
  const handleEdit = (student: Student) => {
    setEditModal({
      isOpen: true,
      student,
    });
  };

  // Ejecuta la acción confirmada (cambiar estado)
  const handleConfirm = async () => {
    if (!confirmationModal.student) return;

    const success = await toggleStudentStatus(
      confirmationModal.student.id,
      token,
    );

    if (success) {
      setConfirmationModal({ isOpen: false, student: null });
      onUpdate();
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay estudiantes registrados
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
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Email
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
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-richblack-900/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Img
                        src={
                          student.image ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${student.name}`
                        }
                        alt={`${student.name}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-richblack-5">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {student.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {student.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {formatDate(student.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          if (student.id) {
                            router.push(
                              `/dashboard/admin/students/${student.id}`,
                            );
                          } else {
                            console.error("Student ID is missing:", student);
                          }
                        }}
                        className="p-2 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                        title="Ver detalles"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 rounded-md bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`p-2 rounded-md transition-colors ${
                          student.active
                            ? "bg-orange-600/20 text-orange-400 hover:bg-orange-600/30"
                            : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        }`}
                        title={student.active ? "Desactivar" : "Activar"}
                      >
                        {student.active ? (
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
      {confirmationModal.isOpen && confirmationModal.student && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.student.active
              ? `¿Estás seguro de desactivar a ${confirmationModal.student.name}?`
              : `¿Estás seguro de activar a ${confirmationModal.student.name}?`,
            text2: confirmationModal.student.active
              ? "El estudiante no podrá iniciar sesión hasta que sea activado nuevamente."
              : "El estudiante podrá iniciar sesión después de la activación.",
            btn1Text: confirmationModal.student.active
              ? "Desactivar"
              : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, student: null }),
          }}
        />
      )}

      {/* Modal de Edición */}
      {editModal.isOpen && editModal.student && (
        <EditStudentModal
          isOpen={editModal.isOpen}
          student={editModal.student}
          token={token}
          onClose={() => setEditModal({ isOpen: false, student: null })}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
