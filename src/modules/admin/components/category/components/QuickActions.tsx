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
    <div className="bg-richblack-700/50 rounded-lg p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-richblack-5 mb-1">
          Acciones rápidas
        </p>
        <p className="text-xs text-richblack-400">
          Gestiona todos los {coursesCount} cursos de una vez
        </p>
      </div>
      <div className="space-y-2">
        {/* Mover todos */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategoryForAll}
            onChange={(e) => onCategorySelect(e.target.value)}
            className="form-style flex-1 text-sm py-2"
            disabled={isProcessing}
          >
            {otherCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={onMoveAll}
            disabled={isProcessing || !selectedCategoryForAll}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {processingCourse === "all" ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Moviendo...
              </>
            ) : (
              <>
                <FiArrowRight />
                Mover Todos
              </>
            )}
          </button>
        </div>
        {/* Eliminar todos */}
        <button
          onClick={onDeleteAll}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiTrash2 />
          Eliminar Todos los Cursos
        </button>
      </div>
    </div>
  );
}

