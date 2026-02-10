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
      <div className="bg-white rounded-[2.5rem] p-16 border border-cem-neutral-gray-100 text-center shadow-sm">
        <div className="w-24 h-24 bg-cem-neutral-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiEye className="text-4xl text-cem-neutral-gray-200" />
        </div>
        <p className="text-cem-neutral-gray-900 text-2xl font-black mb-2">
          Sin alumnos registrados
        </p>
        <p className="text-cem-neutral-gray-500 font-medium italic">
          No hay estudiantes que coincidan con los filtros de búsqueda actuales.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-cem-neutral-gray-50/50 border-b border-cem-neutral-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Estudiante perfil
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Email de contacto
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Estado cuenta
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Fecha ingreso
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] text-right">
                  Gestión
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cem-neutral-gray-50">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-cem-neutral-gray-50/30 transition-all group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Img
                          src={
                            student.image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${student.name}`
                          }
                          alt={`${student.name}`}
                          className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-2 ring-white"
                        />
                        {student.active && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-caribbeangreen-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors">
                          {student.name}
                        </p>
                        <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest mt-1">
                          Ref: {student.id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-cem-neutral-gray-600">
                      {student.email}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.active
                          ? "bg-caribbeangreen-400/10 text-caribbeangreen-400 border border-caribbeangreen-400/20"
                          : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400 border border-cem-neutral-gray-200"
                        }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${student.active ? "bg-caribbeangreen-400" : "bg-cem-neutral-gray-400"}`}></span>
                      {student.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-cem-neutral-gray-500">
                      {formatDate(student.createdAt)}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() => {
                          if (student.id) {
                            router.push(
                              `/dashboard/admin/students/${student.id}`,
                            );
                          }
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-cem-neutral-gray-100 text-cem-primary hover:bg-cem-primary hover:text-white transition-all shadow-sm"
                        title="Ver expediente"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-cem-neutral-gray-100 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                        title="Editar información"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shadow-sm ${student.active
                            ? "bg-white border-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-white border-caribbeangreen-50 text-caribbeangreen-400 hover:bg-caribbeangreen-400 hover:text-white"
                          }`}
                        title={student.active ? "Suspender acceso" : "Activar acceso"}
                      >
                        {student.active ? (
                          <FiXCircle size={18} />
                        ) : (
                          <FiCheckCircle size={18} />
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
