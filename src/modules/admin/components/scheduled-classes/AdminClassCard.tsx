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
    <div className="bg-white rounded-[2rem] p-8 border border-cem-neutral-gray-100 hover:border-cem-primary/50 transition-all shadow-sm hover:shadow-xl group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-black text-cem-neutral-gray-900 mb-2 group-hover:text-cem-primary transition-colors leading-tight">{clase.title}</h3>
          <p className="text-sm font-medium text-cem-neutral-gray-500 line-clamp-2 leading-relaxed">{clase.description}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive
            ? "bg-caribbeangreen-400/10 text-caribbeangreen-400 border border-caribbeangreen-400/20"
            : "bg-cem-neutral-gray-100 text-cem-neutral-gray-400 border border-cem-neutral-gray-200"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-caribbeangreen-400" : "bg-cem-neutral-gray-400"}`}></span>
          {isActive ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cem-neutral-gray-50 flex items-center justify-center text-xl">📅</div>
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-widest mb-0.5">Fecha y Hora</p>
            <p className="text-sm font-bold text-cem-neutral-gray-900">{fechaFormateada}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cem-neutral-gray-50 flex items-center justify-center text-xl">⏱️</div>
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-widest mb-0.5">Duración</p>
            <p className="text-sm font-bold text-cem-neutral-gray-900">{clase.duration} minutos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cem-neutral-gray-50 flex items-center justify-center text-xl">👥</div>
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-widest mb-0.5">Inscritos</p>
            <p className={`text-sm font-black ${clase.enrollmentCount === 0
              ? "text-cem-neutral-gray-300"
              : clase.enrollmentCount < 10
                ? "text-yellow-500"
                : "text-caribbeangreen-400"
              }`}>
              {clase.enrollmentCount} {clase.enrollmentCount === 1 ? 'inscrito' : 'inscritos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cem-neutral-gray-50 flex items-center justify-center text-xl">🎥</div>
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-widest mb-0.5">Plataforma</p>
            <span
              className={`inline-flex px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${obtenerColorPlataforma(clase.platform)} ${obtenerColorTextoPlataforma(clase.platform)}`}
            >
              {clase.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-cem-neutral-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-cem-primary/10 flex items-center justify-center text-xs">👤</div>
          <p className="text-xs font-bold text-cem-neutral-gray-500">
            Autor: <span className="text-cem-neutral-gray-900 font-black">
              {clase.createdBy.firstName} {clase.createdBy.lastName}
            </span>
            <span className="ml-2 px-1.5 py-0.5 bg-cem-neutral-gray-100 rounded text-[9px] uppercase font-black text-cem-neutral-gray-400">{clase.createdBy.accountType}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {onToggleActive && (
            <button
              onClick={handleToggle}
              disabled={cambiandoEstado}
              className={`flex-1 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm border ${isActive
                ? "bg-white border-red-50 text-red-500 hover:bg-red-50"
                : "bg-white border-caribbeangreen-50 text-caribbeangreen-400 hover:bg-caribbeangreen-50"
                } ${cambiandoEstado ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
            >
              {cambiandoEstado ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : isActive ? (
                <>
                  <span className="text-lg">👁️</span>
                  Desactivar
                </>
              ) : (
                <>
                  <span className="text-lg">✅</span>
                  Activar
                </>
              )}
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(clase.id)}
              className="px-6 py-3 bg-white border border-cem-neutral-gray-100 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
            >
              <span className="text-lg">✏️</span>
              Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(clase.id)}
              className="px-6 py-3 bg-white border border-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
            >
              <span className="text-lg">🗑️</span>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

