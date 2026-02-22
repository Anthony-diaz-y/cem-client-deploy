"use client";

import React, { useState } from "react";
import { FiTrash2, FiAlertCircle } from "react-icons/fi";
import { deleteLearningPath } from "@shared/services/admin/learningPaths";
import { CategoryModalLayout } from "../category/components/CategoryModalLayout";
import { LearningPath } from "@shared/services/admin/types";

interface DeleteLearningPathModalProps {
  isOpen: boolean;
  learningPath: LearningPath;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export default function DeleteLearningPathModal({
  isOpen,
  learningPath,
  onClose,
  onSuccess,
  token,
}: DeleteLearningPathModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const success = await deleteLearningPath(learningPath.id, token);
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting learning path:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Ruta de Aprendizaje"
      icon={<FiTrash2 className="text-2xl text-pink-500" />}
      loading={loading}
      footer={
        <div className="flex gap-4 w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-cem-neutral-gray-100 text-cem-neutral-gray-700 rounded-xl font-bold hover:bg-cem-neutral-gray-200 transition-all font-outfit"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-8 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 min-w-[150px] font-outfit"
          >
            {loading ? "Eliminando..." : "Eliminar Ruta"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-8 space-y-4">
        <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
          <FiAlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-cem-neutral-gray-900">
            ¿Estás seguro de eliminar esta ruta?
          </h3>
          <p className="text-cem-neutral-gray-500 text-sm max-w-xs">
            Vas a eliminar la ruta{" "}
            <span className="font-bold text-cem-neutral-gray-700">
              "{learningPath.title}"
            </span>
            . Esta acción no afectará a los cursos individuales, pero la
            trayectoria ya no estará disponible para los estudiantes.
          </p>
        </div>
      </div>
    </CategoryModalLayout>
  );
}
