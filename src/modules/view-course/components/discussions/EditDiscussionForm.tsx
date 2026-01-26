"use client";

import React, { useState } from "react";
import { SubsectionDiscussion } from "../../types";
import { updateDiscussion } from "../../services/discussionAPI";
import { VIEW_COURSE_TEXTS } from "../../constants/viewCourse.constants";

interface EditDiscussionFormProps {
  discussion: SubsectionDiscussion;
  onCancel: () => void;
  onSuccess: (updatedDiscussion: SubsectionDiscussion) => void;
}

/**
 * Formulario para editar una pregunta/discusión
 */
const EditDiscussionForm: React.FC<EditDiscussionFormProps> = ({
  discussion,
  onCancel,
  onSuccess,
}) => {
  const [question, setQuestion] = useState(discussion.question);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (question.trim().length < VIEW_COURSE_TEXTS.discussions.createForm.minLength) {
      setError(VIEW_COURSE_TEXTS.discussions.createForm.validation.minLength);
      return;
    }

    setLoading(true);
    try {
      const updatedDiscussion = await updateDiscussion(discussion.id, question.trim());
      if (updatedDiscussion) {
        onSuccess(updatedDiscussion);
      }
    } catch (err) {
      setError("Error al actualizar la pregunta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-richblack-5 mb-4">Editar Pregunta</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-richblack-300 mb-2">
            {VIEW_COURSE_TEXTS.discussions.createForm.question}
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 resize-none"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-richblack-400">
            {VIEW_COURSE_TEXTS.discussions.createForm.characterCount(question.length)}
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
            {VIEW_COURSE_TEXTS.discussions.createForm.buttons.cancel}
          </button>
          <button
            type="submit"
            disabled={loading || question.trim().length < VIEW_COURSE_TEXTS.discussions.createForm.minLength}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? VIEW_COURSE_TEXTS.reviewModal.buttons.saving : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDiscussionForm;

