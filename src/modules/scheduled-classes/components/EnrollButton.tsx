"use client";

import { useState, useEffect } from "react";
import { inscribirseEnClase, desinscribirseDeClase } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

interface EnrollButtonProps {
  classId: string;
  isEnrolled: boolean;
  onEnrollChange: () => void;
  token: string;
}

// Botón para inscribirse o desinscribirse de una clase
export default function EnrollButton({ classId, isEnrolled, onEnrollChange, token }: EnrollButtonProps) {
  const [cargando, setCargando] = useState(false);
  const [inscrito, setInscrito] = useState(isEnrolled);

  // Sincronizar estado interno con el cambio de props
  useEffect(() => {
    setInscrito(isEnrolled);
  }, [isEnrolled]);

  const manejarClick = async () => {
    setCargando(true);

    try {
      if (inscrito) {
        await desinscribirseDeClase(classId, token);
        setInscrito(false);
        toast.success(SCHEDULED_CLASSES_TEXTS.components.enrollButton.success.unenrolled);
      } else {
        await inscribirseEnClase(classId, token);
        setInscrito(true);
        toast.success(SCHEDULED_CLASSES_TEXTS.components.enrollButton.success.enrolled);
      }
      onEnrollChange();
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.components.enrollButton.error;
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  if (inscrito) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-green-50 text-green-700 border border-green-100 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center shadow-sm">
          <span className="mr-2 text-base">✓</span> {SCHEDULED_CLASSES_TEXTS.components.enrollButton.enrolled}
        </div>
        <button
          onClick={manejarClick}
          disabled={cargando}
          className="mt-1 text-[10px] text-gray-400 hover:text-red-500 font-medium transition-colors uppercase tracking-wider disabled:opacity-50"
        >
          {cargando ? SCHEDULED_CLASSES_TEXTS.components.enrollButton.canceling : SCHEDULED_CLASSES_TEXTS.components.enrollButton.cancelEnrollment}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={manejarClick}
      disabled={cargando}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {cargando ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {SCHEDULED_CLASSES_TEXTS.components.enrollButton.processing}
        </span>
      ) : (
        SCHEDULED_CLASSES_TEXTS.components.enrollButton.enroll
      )}
    </button>
  );
}
