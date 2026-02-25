"use client";

import React, { useState } from "react";
import { FiPlusCircle, FiBookOpen, FiImage, FiSmile } from "react-icons/fi";
import { createLearningPath } from "@shared/services/admin/learningPaths";
import { CategoryModalLayout } from "../category/components/CategoryModalLayout";
import { SvgIconUploader } from "../category/components/SvgIconUploader";
import CourseMultiSelect from "./components/CourseMultiSelect";
import { toast } from "react-hot-toast";

interface CreateLearningPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export default function CreateLearningPathModal({
  isOpen,
  onClose,
  onSuccess,
  token,
}: CreateLearningPathModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        icon: icon.trim() || undefined,
        courseIds: courseIds.length > 0 ? courseIds : undefined,
      };

      const result = await createLearningPath(data, token);
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating learning path:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Ruta de Aprendizaje"
      icon={<FiPlusCircle className="text-2xl text-cem-primary" />}
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
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 min-w-[150px] font-outfit"
          >
            {loading ? "Creando..." : "Crear Ruta"}
          </button>
        </div>
      }
    >
      <div className="space-y-6 w-full py-4 flex flex-col items-center">
        {/* Title Input */}
        <div className="w-full max-w-[744px] flex flex-col space-y-1">
          <label className="text-sm font-bold text-cem-neutral-gray-700 ml-1 flex items-center gap-2">
            <FiBookOpen className="text-cem-primary" /> Nombre de la Ruta
          </label>
          <input
            type="text"
            placeholder="Ej. Fullstack Developer con NestJS y React"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-xl text-sm focus:bg-white focus:border-cem-primary outline-none transition-all font-medium"
          />
        </div>

        {/* Description Input */}
        <div className="w-full max-w-[744px] flex flex-col space-y-1">
          <label className="text-sm font-bold text-cem-neutral-gray-700 ml-1">
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Describe el objetivo de esta trayectoria educativa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 p-4 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-xl text-sm focus:bg-white focus:border-cem-primary outline-none transition-all font-medium resize-none"
          />
        </div>

        {/* Ícono SVG - Igual que en categorías */}
        <div className="w-full max-w-[744px]">
          <SvgIconUploader value={icon} onChange={setIcon} disabled={loading} />
        </div>

        {/* Course Multi Select */}
        <CourseMultiSelect
          selectedCourseIds={courseIds}
          onChange={setCourseIds}
          token={token}
        />
      </div>
    </CategoryModalLayout>
  );
}
