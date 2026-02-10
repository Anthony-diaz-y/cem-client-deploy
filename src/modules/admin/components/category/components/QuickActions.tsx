/**
 * Componente para las acciones rápidas (mover todos / eliminar todos)
 */

import React from "react";
import { toast } from "react-hot-toast";
import { FiTrash2, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import type { Category } from "@shared/services/adminAPI";

interface QuickActionsProps {
  coursesCount: number;
  otherCategories: Category[];
  selectedCategoryForAll: string;
  isProcessing: boolean;
  processingCourse: string | null;
  onCategorySelect: (categoryId: string) => void;
  onMoveAll: () => void;
  onDeleteAll: () => void;
}

export default function QuickActions({
  coursesCount,
  otherCategories,
  selectedCategoryForAll,
  isProcessing,
  processingCourse,
  onCategorySelect,
  onMoveAll,
  onDeleteAll,
}: QuickActionsProps) {
  if (otherCategories.length === 0 || coursesCount <= 1) {
    return null;
  }

  return (
    <div className="bg-cem-neutral-gray-50/50 rounded-[1.5rem] border border-cem-neutral-gray-100 p-6 space-y-5">
      <div>
        <p className="text-sm font-black text-cem-neutral-gray-900 uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          Acciones en lote
        </p>
        <p className="text-xs text-cem-neutral-gray-500 font-medium">
          Gestiona los {coursesCount} cursos seleccionados simultáneamente
        </p>
      </div>
      <div className="space-y-4">
        {/* Mover todos */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedCategoryForAll}
            onChange={(e) => onCategorySelect(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-cem-neutral-gray-100 rounded-xl text-sm font-bold text-cem-neutral-gray-900 focus:ring-2 focus:ring-cem-primary/20 focus:border-cem-primary outline-none cursor-pointer shadow-sm"
            disabled={isProcessing}
          >
            {otherCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                Reubicar en: {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={onMoveAll}
            disabled={isProcessing || !selectedCategoryForAll}
            className="px-8 py-3.5 bg-cem-primary text-white rounded-xl hover:bg-cem-primary-dark transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-cem-primary/10 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap transform active:scale-95"
          >
            {processingCourse === "all" ? (
              <>
                <FiRefreshCw className="animate-spin text-lg" />
                Moviendo...
              </>
            ) : (
              <>
                <FiArrowRight className="text-lg" />
                Mover Grupo
              </>
            )}
          </button>
        </div>

        {/* Separador visual */}
        <div className="flex items-center gap-4 py-1">
          <div className="h-px bg-cem-neutral-gray-100 flex-1"></div>
          <span className="text-[10px] font-black text-cem-neutral-gray-300 uppercase tracking-[0.2em]">o también</span>
          <div className="h-px bg-cem-neutral-gray-100 flex-1"></div>
        </div>

        {/* Eliminar todos */}
        <button
          onClick={onDeleteAll}
          disabled={isProcessing}
          className="w-full px-6 py-4 bg-white text-red-500 border-2 border-dashed border-red-100 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 group"
        >
          <FiTrash2 className="text-lg group-hover:shake" />
          Dar de baja todos los cursos
        </button>
      </div>
    </div>
  );
}

