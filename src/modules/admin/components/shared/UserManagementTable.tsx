"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Img, ConfirmationModal } from "@shared/components";
import { FiEye, FiEdit, FiCheckCircle, FiTrash2 } from "react-icons/fi";

// Interfaz base que deben cumplir tanto Instructores como Alumnos
interface BaseUser {
  id: string;
  name: string;
  email: string;
  active?: boolean;
  approved?: boolean;
  image?: string;
  createdAt: string;
}

interface UserManagementTableProps<T extends BaseUser> {
  users: T[];
  userLabel: string; // "Docente", "Alumno", etc.
  basePath: string;  // "/dashboard/admin/instructors"
  token: string;
  onUpdate: () => void;
  onToggleStatus: (userId: string, currentStatus: boolean, token: string) => Promise<boolean>;
  onEdit?: (user: T) => void;
  showValidationColumn?: boolean;
  hideContainerBorder?: boolean;
}

const HeaderCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-4 py-3 text-[12px] font-bold tracking-widest text-cem-neutral-gray-400 bg-cem-neutral-gray-50/50 first:rounded-tl-xl last:rounded-tr-xl ${className}`}>
    <div className="flex items-center gap-1.5">
      {children}
      <div className="flex flex-col text-[7px] opacity-30 leading-[1.1]">
        <span>▲</span>
        <span className="-mt-0.5">▼</span>
      </div>
    </div>
  </th>
);

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).replace(".", "");
};

/**
 * Tabla genérica para la gestión de usuarios (Instructores/Alumnos)
 */
export default function UserManagementTable<T extends BaseUser>({
  users,
  userLabel,
  basePath,
  token,
  onUpdate,
  onToggleStatus,
  onEdit,
  showValidationColumn = true,
  hideContainerBorder = false,
}: UserManagementTableProps<T>) {
  const router = useRouter();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    user: T | null;
  }>({
    isOpen: false,
    user: null,
  });

  const handleToggleStatusRequest = (user: T) => {
    setConfirmationModal({
      isOpen: true,
      user,
    });
  };

  const handleConfirm = async () => {
    if (!confirmationModal.user) return;

    const currentStatus = !!confirmationModal.user.active;
    const success = await onToggleStatus(
      confirmationModal.user.id,
      currentStatus,
      token,
    );

    if (success) {
      setConfirmationModal({ isOpen: false, user: null });
      onUpdate();
    }
  };

  if (users.length === 0) {
    return (
      <div className={`p-16 text-center ${!hideContainerBorder ? "bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 shadow-sm" : ""}`}>
        <div className="w-24 h-24 bg-cem-neutral-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiEye className="text-4xl text-cem-neutral-gray-200" />
        </div>
        <p className="text-cem-neutral-gray-900 text-2xl font-black mb-2">
          Sin registros encontrados
        </p>
        <p className="text-cem-neutral-gray-500 font-medium italic">
          No hay {userLabel.toLowerCase()}s que coincidan con los criterios actuales.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={!hideContainerBorder ? "bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow" : "overflow-hidden"}>
        <div className="overflow-x-auto overflow-y-hidden min-h-[630px]">
          <table className="w-full text-left table-fixed min-w-[800px]">
            <thead className="bg-cem-neutral-gray-200">
              <tr className="border-b border-cem-neutral-gray-100">
                <HeaderCell className="w-[80px]">ID</HeaderCell>
                <HeaderCell className="w-[180px]">{userLabel}</HeaderCell>
                <HeaderCell className="w-[220px]">Email</HeaderCell>
                {showValidationColumn && <HeaderCell className="w-[110px]">Validación</HeaderCell>}
                <HeaderCell className="w-[90px]">Estado</HeaderCell>
                <HeaderCell className="w-[110px]">Registro</HeaderCell>
                <HeaderCell className="text-right w-[120px]">Operaciones</HeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-cem-neutral-gray-50">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-cem-neutral-gray-50/20 transition-all group"
                >
                  <td className="px-4 py-3">
                    <p className="text-[10px] font-medium text-cem-neutral-gray-400">
                      {user.id.slice(-8).toUpperCase()}
                    </p>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-shrink-0">
                        <Img
                          src={
                            user.image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
                          }
                          alt={`${user.name}`}
                          className="h-8 w-8 rounded-full object-cover border border-cem-neutral-gray-100 shadow-sm"
                        />
                      </div>
                      <p className="text-xs font-bold text-cem-neutral-gray-700 truncate">
                        {user.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-xs font-medium text-cem-neutral-gray-500 truncate">
                      {user.email}
                    </p>
                  </td>
                  {showValidationColumn && (
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold min-w-[80px] ${user.approved
                          ? "bg-[#D1FAE5] text-[#059669]"
                          : "bg-cem-primary/10 text-cem-primary"
                          }`}
                      >
                        {user.approved ? "Verificado" : "Revision"}
                      </span>
                    </td>
                  )}
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold min-w-[70px] ${user.active
                        ? "bg-[#D1FAE5] text-[#059669]"
                        : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400"
                        }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-xs font-medium text-cem-neutral-gray-500">
                      {formatShortDate(user.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5 font-bold">
                      <button
                        onClick={() => router.push(`${basePath}/${user.id}`)}
                        className="p-1.5 rounded-lg bg-cem-teal-50 text-cem-primary hover:bg-cem-primary hover:text-white transition-all"
                        title={`Ver perfil de ${userLabel.toLowerCase()}`}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit ? onEdit(user) : router.push(`${basePath}/${user.id}/edit`)}
                        className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                        title="Editar perfil"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatusRequest(user)}
                        className={`p-1.5 rounded-lg transition-all ${user.active ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white"}`}
                        title={user.active ? "Suspender acceso" : "Restaurar acceso"}
                      >
                        {user.active ? <FiTrash2 size={16} /> : <FiCheckCircle size={16} />}
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
      {confirmationModal.isOpen && confirmationModal.user && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.user.active
              ? `¿Estás seguro de desactivar a ${confirmationModal.user.name}?`
              : `¿Estás seguro de activar a ${confirmationModal.user.name}?`,
            text2: confirmationModal.user.active
              ? `El ${userLabel.toLowerCase()} no podrá iniciar sesión hasta que sea activado nuevamente.`
              : `El ${userLabel.toLowerCase()} podrá iniciar sesión después de la activación.`,
            btn1Text: confirmationModal.user.active
              ? "Desactivar"
              : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, user: null }),
          }}
        />
      )}
    </>
  );
}
