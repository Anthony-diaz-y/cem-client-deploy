"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  onConfirm: () => Promise<void>;
}

/**
 * Modal de confirmación para eliminar un curso individual
 * Incluye advertencia clara y confirmación antes de proceder
 */
export default function DeleteCourseModal({
  isOpen,
  onClose,
  courseName,
  onConfirm,
}: DeleteCourseModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error: any) {
      // No mostrar toast si es error 401 (el interceptor ya lo maneja)
      if (error?.response?.status !== 401) {
        toast.error(error.message || "Error al eliminar el curso");
      }
      // No cerrar el modal si hay error, permitir reintentar
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1002] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10">
      <div className="w-11/12 max-w-md rounded-lg border border-richblack-400 bg-richblack-800 p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <FiTrash2 className="text-xl text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-richblack-5">
              Confirmar Eliminación
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-richblack-400 hover:text-richblack-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-richblack-300 mb-2">
              ¿Estás seguro de que deseas eliminar el curso:
            </p>
            <p className="text-lg font-semibold text-red-400 mb-4">
              "{courseName}"?
            </p>
          </div>

          <div className="bg-yellow-500/10 border-l-4 border-yellow-500/30 p-4 rounded">
            <p className="text-yellow-400 text-sm">
              <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
              El curso será eliminado permanentemente.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-6 border-t border-richblack-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <FiTrash2 />
                Sí, Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

