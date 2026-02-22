"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "@shared/services/apiConnector";
import { subsectionDiscussionsEndpoints } from "@/shared/services/apis";
import type { DiscussionBySubSection, DiscussionReply } from "@shared/services/adminAPI";

export interface DiscussionWithReplies {
  id: string;
  question: string;
  userId: string;
  userName: string;
  userAccountType: "Admin" | "Instructor" | "Student";
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  replies?: DiscussionReply[];
}

export interface UseDiscussionsByLessonOptions {
  discussions: DiscussionBySubSection[];
  token: string;
  onUpdate?: () => void;
}

export function useDiscussionsByLesson({
  discussions,
  token,
  onUpdate,
}: UseDiscussionsByLessonOptions) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(
    new Set(),
  );
  const [editingDiscussion, setEditingDiscussion] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<{ [key: string]: string }>({});
  const [editQuestion, setEditQuestion] = useState<{ [key: string]: string }>({});
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [editReply, setEditReply] = useState<{ [key: string]: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "discussion" | "reply";
    id: string;
  } | null>(null);

  const toggleLesson = useCallback((lessonId: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  }, []);

  const toggleDiscussion = useCallback((discussionId: string) => {
    setExpandedDiscussions((prev) => {
      const next = new Set(prev);
      if (next.has(discussionId)) next.delete(discussionId);
      else next.add(discussionId);
      return next;
    });
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  }, []);

  const getAccountTypeBadge = useCallback((type: string) => {
    const badges: Record<string, string> = {
      Admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Instructor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Student: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return badges[type] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }, []);

  const handleCreateDiscussion = useCallback(
    async (subSectionId: string) => {
      const question = newQuestion[subSectionId]?.trim();
      if (!question) {
        toast.error("Por favor ingresa una pregunta");
        return;
      }
      const toastId = toast.loading("Creando pregunta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "POST",
          subsectionDiscussionsEndpoints.CREATE_DISCUSSION,
          { question, subSectionId },
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Pregunta creada exitosamente", { id: toastId });
          setNewQuestion((prev) => ({ ...prev, [subSectionId]: "" }));
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al crear la pregunta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al crear la pregunta",
          { id: toastId },
        );
      }
    },
    [newQuestion, token, onUpdate],
  );

  const handleUpdateDiscussion = useCallback(
    async (discussionId: string) => {
      const question = editQuestion[discussionId]?.trim();
      if (!question) {
        toast.error("Por favor ingresa una pregunta");
        return;
      }
      const toastId = toast.loading("Actualizando pregunta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "PUT",
          `${subsectionDiscussionsEndpoints.UPDATE_DISCUSSION}/${discussionId}`,
          { question },
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Pregunta actualizada exitosamente", { id: toastId });
          setEditingDiscussion(null);
          setEditQuestion((prev) => ({ ...prev, [discussionId]: "" }));
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al actualizar la pregunta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al actualizar la pregunta",
          { id: toastId },
        );
      }
    },
    [editQuestion, token, onUpdate],
  );

  const handleDeleteDiscussion = useCallback(
    async (discussionId: string) => {
      const toastId = toast.loading("Eliminando pregunta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "DELETE",
          `${subsectionDiscussionsEndpoints.DELETE_DISCUSSION}/${discussionId}`,
          undefined,
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Pregunta eliminada exitosamente", { id: toastId });
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al eliminar la pregunta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al eliminar la pregunta",
          { id: toastId },
        );
      }
    },
    [token, onUpdate],
  );

  const handleCreateReply = useCallback(
    async (discussionId: string) => {
      const reply = newReply[discussionId]?.trim();
      if (!reply) {
        toast.error("Por favor ingresa una respuesta");
        return;
      }
      const toastId = toast.loading("Enviando respuesta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "POST",
          subsectionDiscussionsEndpoints.CREATE_REPLY,
          { reply, discussionId },
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Respuesta creada exitosamente", { id: toastId });
          setNewReply((prev) => ({ ...prev, [discussionId]: "" }));
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al crear la respuesta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al crear la respuesta",
          { id: toastId },
        );
      }
    },
    [newReply, token, onUpdate],
  );

  const handleUpdateReply = useCallback(
    async (replyId: string) => {
      const reply = editReply[replyId]?.trim();
      if (!reply) {
        toast.error("Por favor ingresa una respuesta");
        return;
      }
      const toastId = toast.loading("Actualizando respuesta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "PUT",
          `${subsectionDiscussionsEndpoints.UPDATE_REPLY}/${replyId}`,
          { reply },
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Respuesta actualizada exitosamente", { id: toastId });
          setEditingReply(null);
          setEditReply((prev) => ({ ...prev, [replyId]: "" }));
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al actualizar la respuesta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al actualizar la respuesta",
          { id: toastId },
        );
      }
    },
    [editReply, token, onUpdate],
  );

  const handleDeleteReply = useCallback(
    async (replyId: string) => {
      const toastId = toast.loading("Eliminando respuesta...");
      try {
        const response = await apiConnector<{ success: boolean; message?: string }>(
          "DELETE",
          `${subsectionDiscussionsEndpoints.DELETE_REPLY}/${replyId}`,
          undefined,
          { Authorization: `Bearer ${token}` },
        );
        if (response?.data?.success) {
          toast.success("Respuesta eliminada exitosamente", { id: toastId });
          onUpdate?.();
        } else {
          throw new Error(response?.data?.message ?? "Error al eliminar la respuesta");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          err?.response?.data?.message ?? err?.message ?? "Error al eliminar la respuesta",
          { id: toastId },
        );
      }
    },
    [token, onUpdate],
  );

  return {
    expandedLessons,
    expandedDiscussions,
    editingDiscussion,
    setEditingDiscussion,
    editingReply,
    setEditingReply,
    newQuestion,
    setNewQuestion,
    editQuestion,
    setEditQuestion,
    newReply,
    setNewReply,
    editReply,
    setEditReply,
    deleteConfirm,
    setDeleteConfirm,
    toggleLesson,
    toggleDiscussion,
    formatDate,
    getAccountTypeBadge,
    handleCreateDiscussion,
    handleUpdateDiscussion,
    handleDeleteDiscussion,
    handleCreateReply,
    handleUpdateReply,
    handleDeleteReply,
  };
}
