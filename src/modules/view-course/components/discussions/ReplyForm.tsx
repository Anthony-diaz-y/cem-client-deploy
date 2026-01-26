"use client";

import React, { useState } from "react";
import { createReply } from "../../services/discussionAPI";
import type { SubsectionDiscussion } from "../../types";
import { HiArrowLeft } from "react-icons/hi2";
import { VIEW_COURSE_TEXTS } from "../../constants/viewCourse.constants";

interface ReplyFormProps {
  discussionId: string;
  onSuccess: (updatedDiscussion: SubsectionDiscussion) => void;
}

/**
 * Formulario para crear una respuesta - diseño compacto y simple
 * Actualizado para usar la discusión completa devuelta por el backend
 */
const ReplyForm: React.FC<ReplyFormProps> = ({
  discussionId,
  onSuccess,
}) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (reply.trim().length < VIEW_COURSE_TEXTS.discussions.reply.minLength) {
      setError(VIEW_COURSE_TEXTS.discussions.reply.validation.minLength);
      return;
    }

    setLoading(true);
    try {
      const updatedDiscussion = await createReply(reply.trim(), discussionId);
      if (updatedDiscussion) {
        setReply("");
        onSuccess(updatedDiscussion);
      }
    } catch (err) {
      setError(VIEW_COURSE_TEXTS.discussions.reply.validation.createError);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={VIEW_COURSE_TEXTS.discussions.reply.placeholder}
          className="w-full px-3 py-2 pr-10 bg-richblack-700/50 border border-richblack-600/50 rounded-lg text-sm text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-richblack-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || reply.trim().length < VIEW_COURSE_TEXTS.discussions.reply.minLength}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-richblack-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
          aria-label={VIEW_COURSE_TEXTS.discussions.reply.send}
        >
          <HiArrowLeft className="w-4 h-4 rotate-180" />
        </button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    </form>
  );
};

export default ReplyForm;
