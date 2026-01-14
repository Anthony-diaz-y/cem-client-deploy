"use client";

import React, { useState } from "react";
import { createDiscussion } from "../../services/discussionAPI";
import { HiXMark } from "react-icons/hi2";

interface CreateDiscussionFormProps {
  subSectionId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Formulario para crear una nueva pregunta/discusión
 */
const CreateDiscussionForm: React.FC<CreateDiscussionFormProps> = ({
  subSectionId,
  onCancel,
  onSuccess,
}) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (question.trim().length < 10) {
      setError("La pregunta debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);
    try {
      const result = await createDiscussion(question.trim(), subSectionId);
      if (result) {
        setQuestion("");
        onSuccess();
      }
    } catch (err) {
      setError("Error al crear la pregunta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-richblack-5">Nueva Pregunta</h3>
        <button
          onClick={onCancel}
          className="text-richblack-400 hover:text-richblack-100"
        >
          <HiXMark className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-richblack-300 mb-2">
            Pregunta
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Escribe tu pregunta aquí (mínimo 10 caracteres)..."
            rows={6}
            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 resize-none"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-richblack-400">
            {question.length} / 10 caracteres mínimos
          </p>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-richblack-300 hover:text-richblack-100 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || question.trim().length < 10}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publicando..." : "Publicar Pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscussionForm;

