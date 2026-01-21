"use client";

import React, { useState } from "react";
import { createReply } from "../../services/discussionAPI";
import type { SubsectionDiscussion } from "../../types";
import { HiArrowLeft } from "react-icons/hi2";

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

    if (reply.trim().length < 5) {
      setError("La respuesta debe tener al menos 5 caracteres");
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
      setError("Error al crear la respuesta. Inténtalo de nuevo.");
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
          placeholder="Escribir una respuesta..."
          className="w-full px-3 py-2 pr-10 bg-richblack-700/50 border border-richblack-600/50 rounded-lg text-sm text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-richblack-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || reply.trim().length < 5}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-richblack-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
          aria-label="Enviar respuesta"
        >
          <HiArrowLeft className="w-4 h-4 rotate-180" />
        </button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    </form>
  );
};

export default ReplyForm;
