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
    <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-richblack-5 mb-2">{clase.title}</h3>
          <p className="text-sm text-richblack-400 line-clamp-2">{clase.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {isActive ? "✅ Activa" : "❌ Inactiva"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-xs text-richblack-400">Fecha y Hora</p>
            <p className="text-sm font-medium text-richblack-5">{fechaFormateada}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <div>
            <p className="text-xs text-richblack-400">Duración</p>
            <p className="text-sm font-medium text-richblack-5">{clase.duration} minutos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-xs text-richblack-400">Inscritos</p>
            <p className={`text-sm font-medium ${
              clase.enrollmentCount === 0
                ? "text-gray-400"
                : clase.enrollmentCount < 10
                ? "text-yellow-400"
                : "text-green-400"
            }`}>
              {clase.enrollmentCount} {clase.enrollmentCount === 1 ? 'inscrito' : 'inscritos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">🎥</span>
          <div>
            <p className="text-xs text-richblack-400">Plataforma</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerColorPlataforma(clase.platform)} ${obtenerColorTextoPlataforma(clase.platform)}`}
            >
              {clase.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-richblack-700">
        <p className="text-xs text-richblack-400 mb-3">
          Creado por: <span className="text-richblack-300 font-medium">
            {clase.createdBy.firstName} {clase.createdBy.lastName}
          </span> ({clase.createdBy.accountType})
        </p>

        <div className="flex flex-wrap gap-2">
          {onToggleActive && (
            <button
              onClick={handleToggle}
              disabled={cambiandoEstado}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive
                  ? "bg-orange-600/20 text-orange-400 hover:bg-orange-600/30"
                  : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
              } ${cambiandoEstado ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cambiandoEstado ? '⏳' : isActive ? '👁️ Desactivar' : '✅ Activar'}
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(clase.id)}
              className="px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors font-medium text-sm flex items-center gap-2"
            >
              ✏️ Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(clase.id)}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-medium text-sm flex items-center gap-2"
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

