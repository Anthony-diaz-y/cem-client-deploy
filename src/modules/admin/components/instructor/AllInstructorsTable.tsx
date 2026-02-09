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
      token,
    );

    if (success) {
      setConfirmationModal({ isOpen: false, instructor: null });
      onUpdate();
    }
  };

  if (instructors.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 border border-cem-neutral-gray-100 text-center shadow-sm">
        <div className="w-24 h-24 bg-cem-neutral-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiEye className="text-4xl text-cem-neutral-gray-200" />
        </div>
        <p className="text-cem-neutral-gray-900 text-2xl font-black mb-2">
          Sin registros encontrados
        </p>
        <p className="text-cem-neutral-gray-500 font-medium italic">
          No hay instructores que coincidan con los criterios actuales.
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
                  Instructor perfiL
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Contacto
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Validación
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Estado cuenta
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em]">
                  Registro
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] text-right">
                  Operaciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cem-neutral-gray-50">
              {instructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="hover:bg-cem-neutral-gray-50/30 transition-all group"
                >
                  <td className="px-8 py-5">
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
                        {instructor.active && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-caribbeangreen-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors">
                          {instructor.name}
                        </p>
                        <p className="text-[10px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest mt-0.5">
                          ID: {instructor.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-cem-neutral-gray-700">
                      {instructor.email}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${instructor.approved
                          ? "bg-caribbeangreen-400/10 text-caribbeangreen-400 border border-caribbeangreen-400/20"
                          : "bg-cem-primary/10 text-cem-primary border border-cem-primary/20"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${instructor.approved ? "bg-caribbeangreen-400" : "bg-cem-primary"}`}></span>
                      {instructor.approved ? "Verificado" : "Revision"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${instructor.active
                          ? "bg-caribbeangreen-400/10 text-caribbeangreen-400 border border-caribbeangreen-400/20"
                          : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400 border border-cem-neutral-gray-200"
                        }`}
                    >
                      {instructor.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-cem-neutral-gray-500">
                      {formatDate(instructor.createdAt)}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/instructors/${instructor.id}`,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-cem-neutral-gray-100 text-cem-primary hover:bg-cem-primary hover:text-white transition-all shadow-sm"
                        title="Ver ficha técnica"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/instructors/${instructor.id}/edit`,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-cem-neutral-gray-100 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                        title="Editar perfil"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(instructor)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shadow-sm ${instructor.active
                            ? "bg-white border-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-white border-caribbeangreen-50 text-caribbeangreen-400 hover:bg-caribbeangreen-400 hover:text-white"
                          }`}
                        title={instructor.active ? "Suspender acceso" : "Restaurar acceso"}
                      >
                        {instructor.active ? (
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
      {confirmationModal.isOpen && confirmationModal.instructor && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.instructor.active
              ? `¿Estás seguro de desactivar a ${confirmationModal.instructor.name}?`
              : `¿Estás seguro de activar a ${confirmationModal.instructor.name}?`,
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
