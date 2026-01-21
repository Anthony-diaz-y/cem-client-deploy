"use client";

import React from "react";
import { IoMdClose, IoMdWarning } from "react-icons/io";
import { SubSection } from "../../../course/types";

interface MoveLectureWarningModalProps {
  isOpen: boolean;
  lecture: SubSection | null;
  fromSectionName: string;
  toSectionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal de advertencia para mover lección entre secciones
export default function MoveLectureWarningModal({
  isOpen,
  lecture,
  fromSectionName,
  toSectionName,
  onConfirm,
  onCancel,
}: MoveLectureWarningModalProps) {
  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-richblack-800 rounded-xl border border-yellow-500/50 w-full max-w-md m-4 shadow-2xl">
        {/* Header con icono de advertencia */}
        <div className="px-6 py-4 border-b border-richblack-700 flex items-center justify-between bg-yellow-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <IoMdWarning className="text-2xl text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-richblack-5">
              Mover Lección
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-richblack-400 hover:text-richblack-5 transition-colors"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="bg-richblack-900/50 rounded-lg p-4 border border-richblack-700">
            <p className="text-sm text-richblack-300 mb-2">Lección:</p>
            <p className="text-richblack-5 font-medium">{lecture?.title || "Sin título"}</p>
          </div>

          <div className="space-y-3">
            <p className="text-richblack-5 text-center">
              ¿Estás seguro de que deseas mover esta lección?
            </p>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex-1 bg-richblack-900/50 rounded-lg p-3 border border-richblack-700">
                <p className="text-xs text-richblack-400 mb-1">Desde:</p>
                <p className="text-sm font-medium text-richblack-5">{fromSectionName}</p>
              </div>

              <div className="text-2xl text-yellow-500">→</div>

              <div className="flex-1 bg-richblack-900/50 rounded-lg p-3 border border-yellow-500/50">
                <p className="text-xs text-richblack-400 mb-1">Hacia:</p>
                <p className="text-sm font-medium text-yellow-50">{toSectionName}</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-xs text-yellow-200">
                ⚠️ Esta acción moverá la lección a una sección diferente del curso.
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="px-6 py-4 border-t border-richblack-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-richblack-700 text-richblack-50 rounded-lg hover:bg-richblack-600 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-500 text-richblack-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
          >
            Mover Lección
          </button>
        </div>
      </div>
    </div>
  );
}

