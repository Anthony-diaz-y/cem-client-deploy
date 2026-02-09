"use client";

import { useState, useEffect } from "react";
import { ClaseProgramada } from "@/types/scheduledClasses.types";
import { formatearFechaProgramada } from "@/shared/utils/scheduledClassUtils";
import { obtenerColorPlataforma, obtenerColorTextoPlataforma } from "@/shared/utils/scheduledClassUtils";

interface AdminClassCardProps {
  clase: ClaseProgramada;
  onToggleActive?: (classId: string, isActive: boolean) => void;
  onEdit?: (classId: string) => void;
  onDelete?: (classId: string) => void;
  token: string;
}

// Tarjeta individual de clase para el panel de administración
export default function AdminClassCard({
  clase,
  onToggleActive,
  onEdit,
  onDelete
}: AdminClassCardProps) {
  // Estado local para el estado activo/inactivo
  const [isActive, setIsActive] = useState(clase.isActive);

  // Sincronizar estado local cuando cambia la prop
  useEffect(() => {
    setIsActive(clase.isActive);
  }, [clase.isActive]);

  const fechaFormateada = formatearFechaProgramada(clase.scheduledDate);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const handleToggle = async () => {
    if (!onToggleActive) return;
    setCambiandoEstado(true);
    const newActiveStatus = !isActive;

    // Actualizar estado local inmediatamente para feedback visual
    setIsActive(newActiveStatus);

    try {
      await onToggleActive(clase.id, newActiveStatus);
    } catch (error) {
      // Revertir estado local si hay error
      setIsActive(!newActiveStatus);
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 hover:border-cem-primary transition-all shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cem-neutral-gray-900 mb-2">{clase.title}</h3>
          <p className="text-sm text-cem-neutral-gray-600 line-clamp-2">{clase.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
            }`}
        >
          {isActive ? "✅ Activa" : "❌ Inactiva"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-xs text-cem-neutral-gray-500">Fecha y Hora</p>
            <p className="text-sm font-medium text-cem-neutral-gray-900">{fechaFormateada}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <div>
            <p className="text-xs text-cem-neutral-gray-500">Duración</p>
            <p className="text-sm font-medium text-cem-neutral-gray-900">{clase.duration} minutos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-xs text-cem-neutral-gray-500">Inscritos</p>
            <p className={`text-sm font-medium ${clase.enrollmentCount === 0
                ? "text-cem-neutral-gray-400"
                : clase.enrollmentCount < 10
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>
              {clase.enrollmentCount} {clase.enrollmentCount === 1 ? 'inscrito' : 'inscritos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">🎥</span>
          <div>
            <p className="text-xs text-cem-neutral-gray-500">Plataforma</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerColorPlataforma(clase.platform)} ${obtenerColorTextoPlataforma(clase.platform)}`}
            >
              {clase.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-cem-neutral-gray-200">
        <p className="text-xs text-cem-neutral-gray-500 mb-3">
          Creado por: <span className="text-cem-neutral-gray-700 font-medium">
            {clase.createdBy.firstName} {clase.createdBy.lastName}
          </span> ({clase.createdBy.accountType})
        </p>

        <div className="flex flex-wrap gap-2">
          {onToggleActive && (
            <button
              onClick={handleToggle}
              disabled={cambiandoEstado}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm ${isActive
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
                } ${cambiandoEstado ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cambiandoEstado ? '⏳' : isActive ? '👁️ Desactivar' : '✅ Activar'}
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(clase.id)}
              className="px-4 py-2 bg-cem-primary/10 text-cem-primary rounded-lg hover:bg-cem-primary/20 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
            >
              ✏️ Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(clase.id)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

