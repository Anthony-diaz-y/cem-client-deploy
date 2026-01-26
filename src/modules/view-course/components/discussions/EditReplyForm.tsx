"use client";

import React, { useState } from "react";
import { SubsectionDiscussionReply } from "../../types";
import { updateReply } from "../../services/discussionAPI";
import type { SubsectionDiscussion } from "../../types";
import { VIEW_COURSE_TEXTS } from "../../constants/viewCourse.constants";

interface EditReplyFormProps {
  reply: SubsectionDiscussionReply;
  onCancel: () => void;
  onSuccess: (updatedDiscussion: SubsectionDiscussion) => void;
}

/**
 * Formulario para editar una respuesta
 * Actualizado para usar la discusión completa devuelta por el backend
 */
const EditReplyForm: React.FC<EditReplyFormProps> = ({
  reply,
  onCancel,
  onSuccess,
}) => {
  const [replyText, setReplyText] = useState(reply.reply);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (replyText.trim().length < VIEW_COURSE_TEXTS.discussions.reply.minLength) {
      setError(VIEW_COURSE_TEXTS.discussions.reply.validation.minLength);
      return;
    }

    setLoading(true);
    try {
      const updatedDiscussion = await updateReply(reply.id, replyText.trim());
      if (updatedDiscussion) {
        onSuccess(updatedDiscussion);
      }
    } catch (err) {
      setError("Error al actualizar la respuesta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-richblack-700 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-richblack-800 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 resize-none"
          disabled={loading}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-richblack-300 hover:text-richblack-100 transition-colors"
            disabled={loading}
          >
            {VIEW_COURSE_TEXTS.discussions.createForm.buttons.cancel}
          </button>
          <button
            type="submit"
            disabled={loading || replyText.trim().length < VIEW_COURSE_TEXTS.discussions.reply.minLength}
            className="px-3 py-1.5 text-sm bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? VIEW_COURSE_TEXTS.reviewModal.buttons.saving : VIEW_COURSE_TEXTS.reviewModal.buttons.save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReplyForm;
