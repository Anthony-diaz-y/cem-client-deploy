"use client";

import { ClaseProgramada } from "@/types/scheduledClasses.types";
import PlatformBadge from "./PlatformBadge";
import StatusBadge from "./StatusBadge";
import EnrollButton from "./EnrollButton";
import { formatearFechaProgramada } from "@/shared/utils/scheduledClassUtils";
import { motion, AnimatePresence } from "framer-motion";
import { actualizarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { useState } from "react";
import toast from "react-hot-toast";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

interface ClassDetailsModalProps {
  clase: ClaseProgramada | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  token: string;
  userRole?: string;
  userId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewEnrolled?: () => void;
}

// Modal con detalles completos de la clase
export default function ClassDetailsModal({
  clase,
  isOpen,
  onClose,
  onRefresh,
  token,
  userRole,
  userId,
  onEdit,
  onDelete,
  onViewEnrolled,
}: ClassDetailsModalProps) {
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  if (!clase) return null;

  const esAdmin = userRole === 'Admin';
  const esInstructor = userRole === 'Instructor';
  const esEstudiante = userRole === 'Student';
  const esDueño = clase.createdBy.id === userId;
  const puedeEditar = esAdmin || (esInstructor && esDueño);
  const puedeEliminar = esAdmin || (esInstructor && esDueño);
  const puedeCambiarEstado = esAdmin;

  // Toggle de estado activo/inactivo (solo para admins)
  const manejarToggleEstado = async () => {
    if (!puedeCambiarEstado) return;
    
    setCambiandoEstado(true);
    try {
      await actualizarClaseProgramada(
        clase.id,
        { isActive: !clase.isActive },
        token
      );
      onRefresh();
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.error;
      toast.error(mensaje);
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{clase.title}</h2>
                    <PlatformBadge platform={clase.platform} />
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.labels.description}</h3>
                  <p className="text-gray-700 leading-relaxed">{clase.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.labels.dateTime}</p>
                      <p className="text-gray-900">{formatearFechaProgramada(clase.scheduledDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.labels.duration}</p>
                      <p className="text-gray-900">{clase.duration} {SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.durationUnit}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">👨‍🏫</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.labels.instructor}</p>
                      <p className="text-gray-900">
                        {clase.createdBy.firstName} {clase.createdBy.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.labels.enrolled}</p>
                      <p className="text-gray-900">{clase.enrollmentCount} {SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.enrolledUnit}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <StatusBadge scheduledDate={clase.scheduledDate} duration={clase.duration} />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-6 rounded-b-2xl border-t border-gray-200">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(esAdmin || esInstructor) && onViewEnrolled && (
                      <button
                        onClick={onViewEnrolled}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
                      >
                        👥 <span className="hidden sm:inline">{SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.viewEnrolled}</span>
                      </button>
                    )}

                    {puedeEditar && (
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={onEdit}
                            className="p-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-sm shadow-sm"
                            title={SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.edit}
                          >
                            ✏️
                          </button>
                        )}
                        {puedeEliminar && onDelete && (
                          <button
                            onClick={onDelete}
                            className="p-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm shadow-sm"
                            title={SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.delete}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Toggle de estado activo/inactivo (solo para admins) */}
                    {puedeCambiarEstado && (
                      <button
                        onClick={manejarToggleEstado}
                        disabled={cambiandoEstado}
                        className={`px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2 ${
                          clase.isActive
                            ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                            : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                        } ${cambiandoEstado ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={clase.isActive ? SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.deactivate : SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.activate}
                      >
                        {cambiandoEstado ? SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.processing : clase.isActive ? SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.deactivate : SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.activate}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 items-center ml-auto">
                    {/* Botón de inscripción solo para estudiantes */}
                    {esEstudiante && (
                      <EnrollButton
                        classId={clase.id}
                        isEnrolled={clase.isEnrolled || false}
                        onEnrollChange={onRefresh}
                        token={token}
                      />
                    )}

                    <a
                      href={clase.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-center whitespace-nowrap shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🔗</span>
                      {clase.platform === 'Zoom' ? SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.openZoom : SCHEDULED_CLASSES_TEXTS.components.classDetailsModal.buttons.goToClass}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
