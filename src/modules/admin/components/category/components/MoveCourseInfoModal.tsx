"use client";

import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiInfo, FiCheck, FiArrowRight } from "react-icons/fi";

interface MoveCourseInfoModalProps {
  isOpen: boolean;
  courseName: string;
  targetCategoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MoveCourseInfoModal({
  isOpen,
  courseName,
  targetCategoryName,
  onConfirm,
  onCancel,
}: MoveCourseInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] grid place-items-center bg-cem-neutral-gray-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[2.5rem] border border-cem-neutral-gray-100 bg-white p-8 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
              <FiInfo className="text-2xl text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-cem-neutral-gray-900 leading-tight">
                Asignación de Sector
              </h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-cem-neutral-gray-400 hover:bg-cem-neutral-gray-50 hover:text-cem-neutral-gray-900 transition-all border border-transparent hover:border-cem-neutral-gray-100"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-cem-neutral-gray-600 font-medium leading-relaxed">
            Has arrastrado{" "}
            <span className="font-bold text-cem-neutral-gray-900">
              "{courseName}"
            </span>{" "}
            a un Sector.
          </p>

          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 border-dashed">
            <p className="text-sm text-blue-700 font-semibold mb-2 flex items-center gap-2">
              Información Importante:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-blue-600/90 font-medium">
                <FiCheck className="mt-0.5 flex-shrink-0" />
                <span>
                  El curso mantendrá su{" "}
                  <span className="font-bold italic">Carrera Obligatoria</span>{" "}
                  actual.
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-600/90 font-medium">
                <FiArrowRight className="mt-0.5 flex-shrink-0" />
                <span>
                  Ahora también será visible bajo el sector{" "}
                  <span className="font-bold">"{targetCategoryName}"</span>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-cem-neutral-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-white text-cem-neutral-gray-500 border border-cem-neutral-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cem-neutral-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-cem-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 transform active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
