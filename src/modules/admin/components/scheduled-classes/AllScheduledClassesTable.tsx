"use client";

import React, { useState, useEffect } from "react";
import { ClaseProgramada } from "@/types/scheduledClasses.types";
import { actualizarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { ConfirmationModal } from "@shared/components";
import { formatearFechaProgramada } from "@/shared/utils/scheduledClassUtils";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";

interface AllScheduledClassesTableProps {
  classes: ClaseProgramada[];
  token: string;
  onUpdate: () => void;
}

// Tabla para mostrar todas las clases programadas con opción de activar/desactivar
export default function AllScheduledClassesTable({
  classes,
  token,
  onUpdate,
}: AllScheduledClassesTableProps) {
  // Estado local de las clases para actualizar sin recargar
  const [localClasses, setLocalClasses] = useState<ClaseProgramada[]>(classes);

  // Sincronizar estado local cuando cambian las props
  useEffect(() => {
    setLocalClasses(classes);
  }, [classes]);

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    class: ClaseProgramada | null;
  }>({
    isOpen: false,
    class: null,
  });

  // Abre el modal de confirmación para cambiar estado activo/inactivo
  const handleToggleStatus = (clase: ClaseProgramada) => {
    setConfirmationModal({
      isOpen: true,
      class: clase,
    });
  };

  // Ejecuta la acción confirmada (cambiar estado)
  const handleConfirm = async () => {
    if (!confirmationModal.class) return;

    const newActiveStatus = !confirmationModal.class.isActive;
    try {
      await actualizarClaseProgramada(
        confirmationModal.class.id,
        { isActive: newActiveStatus },
        token
      );
      
      // Actualizar solo la clase modificada en el estado local
      setLocalClasses((prevClasses) =>
        prevClasses.map((clase) =>
          clase.id === confirmationModal.class!.id
            ? { ...clase, isActive: newActiveStatus }
            : clase
        )
      );

      toast.success(
        newActiveStatus
          ? "Clase activada exitosamente"
          : "Clase desactivada exitosamente"
      );
      setConfirmationModal({ isOpen: false, class: null });
      // No llamar a onUpdate() para evitar recargar toda la página
    } catch (error: unknown) {
      const mensaje =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al cambiar estado de la clase";
      toast.error(mensaje);
    }
  };

  if (localClasses.length === 0) {
    return (
      <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 text-center">
        <p className="text-richblack-400 text-lg">
          No hay clases programadas
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-richblack-900 border-b border-richblack-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Plataforma
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Inscritos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-richblack-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {localClasses.map((clase) => (
                <tr
                  key={clase.id}
                  className="hover:bg-richblack-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-richblack-5">
                      {clase.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {clase.createdBy.firstName} {clase.createdBy.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {formatearFechaProgramada(clase.scheduledDate)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                      {clase.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-richblack-300">
                      {clase.enrollmentCount}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        clase.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {clase.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(clase)}
                        className={`p-2 rounded-md transition-colors ${
                          clase.isActive
                            ? "bg-orange-600/20 text-orange-400 hover:bg-orange-600/30"
                            : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        }`}
                        title={clase.isActive ? "Desactivar" : "Activar"}
                      >
                        {clase.isActive ? (
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
      {confirmationModal.isOpen && confirmationModal.class && (
        <ConfirmationModal
          modalData={{
            text1: confirmationModal.class.isActive
              ? `¿Estás seguro de desactivar la clase "${confirmationModal.class.title}"?`
              : `¿Estás seguro de activar la clase "${confirmationModal.class.title}"?`,
            text2: confirmationModal.class.isActive
              ? "Los estudiantes no podrán ver esta clase hasta que sea activada nuevamente."
              : "Los estudiantes podrán ver e inscribirse en esta clase después de la activación.",
            btn1Text: confirmationModal.class.isActive
              ? "Desactivar"
              : "Activar",
            btn2Text: "Cancelar",
            btn1Handler: handleConfirm,
            btn2Handler: () =>
              setConfirmationModal({ isOpen: false, class: null }),
          }}
        />
      )}
    </>
  );
}

