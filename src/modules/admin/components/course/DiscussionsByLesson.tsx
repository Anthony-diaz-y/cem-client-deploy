"use client";

import React, { useState } from "react";
import {
  DiscussionBySubSection,
  DiscussionReply,
} from "@shared/services/adminAPI";
import {
  FiChevronDown,
  FiChevronRight,
  FiMessageSquare,
  FiUser,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { apiConnector } from "@shared/services/apiConnector";
import { subsectionDiscussionsEndpoints } from "@/shared/services/apis";
import { ConfirmationModal } from "@shared/components";

interface DiscussionWithReplies {
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

interface DiscussionsByLessonProps {
  discussions: DiscussionBySubSection[];
  token: string;
  onUpdate?: () => void;
}

export default function DiscussionsByLesson({
  discussions,
  token,
  onUpdate,
}: DiscussionsByLessonProps) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(
    new Set(),
  );
  const [editingDiscussion, setEditingDiscussion] = useState<string | null>(
    null,
  );
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<{ [key: string]: string }>({});
  const [editQuestion, setEditQuestion] = useState<{ [key: string]: string }>(
    {},
  );
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [editReply, setEditReply] = useState<{ [key: string]: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "discussion" | "reply";
    id: string;
  } | null>(null);
  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const toggleDiscussion = (discussionId: string) => {
    const newExpanded = new Set(expandedDiscussions);
    if (newExpanded.has(discussionId)) {
      newExpanded.delete(discussionId);
    } else {
      newExpanded.add(discussionId);
    }
    setExpandedDiscussions(newExpanded);
  };

  const formatDate = (dateString: string) => {
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
  };

  const getAccountTypeBadge = (type: string) => {
    const badges = {
      Admin: "bg-purple-50 text-purple-600 border-purple-100",
      Instructor: "bg-blue-50 text-blue-600 border-blue-100",
      Student: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };
    return (
      badges[type as keyof typeof badges] ||
      "bg-cem-neutral-gray-50 text-cem-neutral-gray-500 border-cem-neutral-gray-100"
    );
  };

  // CRUD Operations
  const handleCreateDiscussion = async (subSectionId: string) => {
    const question = newQuestion[subSectionId]?.trim();
    if (!question) {
      toast.error("Por favor ingresa una pregunta");
      return;
    }

    const toastId = toast.loading("Creando pregunta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        message?: string;
      }>(
        "POST",
        subsectionDiscussionsEndpoints.CREATE_DISCUSSION,
        { question, subSectionId },
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Pregunta creada exitosamente", { id: toastId });
        setNewQuestion({ ...newQuestion, [subSectionId]: "" });
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al crear la pregunta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al crear la pregunta",
        { id: toastId },
      );
    }
  };

  const handleUpdateDiscussion = async (discussionId: string) => {
    const question = editQuestion[discussionId]?.trim();
    if (!question) {
      toast.error("Por favor ingresa una pregunta");
      return;
    }

    const toastId = toast.loading("Actualizando pregunta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        message?: string;
      }>(
        "PUT",
        `${subsectionDiscussionsEndpoints.UPDATE_DISCUSSION}/${discussionId}`,
        { question },
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Pregunta actualizada exitosamente", { id: toastId });
        setEditingDiscussion(null);
        setEditQuestion({ ...editQuestion, [discussionId]: "" });
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al actualizar la pregunta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al actualizar la pregunta",
        { id: toastId },
      );
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    const toastId = toast.loading("Eliminando pregunta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        data?: any[];
        message?: string;
      }>(
        "DELETE",
        `${subsectionDiscussionsEndpoints.DELETE_DISCUSSION}/${discussionId}`,
        undefined,
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Pregunta eliminada exitosamente", { id: toastId });
        // El backend ahora devuelve la lista completa actualizada en response.data.data
        // Notificar al componente padre para que actualice las discusiones
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al eliminar la pregunta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al eliminar la pregunta",
        { id: toastId },
      );
    }
  };

  const handleCreateReply = async (discussionId: string) => {
    const reply = newReply[discussionId]?.trim();
    if (!reply) {
      toast.error("Por favor ingresa una respuesta");
      return;
    }

    const toastId = toast.loading("Enviando respuesta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        message?: string;
      }>(
        "POST",
        subsectionDiscussionsEndpoints.CREATE_REPLY,
        { reply, discussionId },
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Respuesta creada exitosamente", { id: toastId });
        setNewReply({ ...newReply, [discussionId]: "" });
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al crear la respuesta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al crear la respuesta",
        { id: toastId },
      );
    }
  };

  const handleUpdateReply = async (replyId: string) => {
    const reply = editReply[replyId]?.trim();
    if (!reply) {
      toast.error("Por favor ingresa una respuesta");
      return;
    }

    const toastId = toast.loading("Actualizando respuesta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        message?: string;
      }>(
        "PUT",
        `${subsectionDiscussionsEndpoints.UPDATE_REPLY}/${replyId}`,
        { reply },
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Respuesta actualizada exitosamente", { id: toastId });
        setEditingReply(null);
        setEditReply({ ...editReply, [replyId]: "" });
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al actualizar la respuesta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al actualizar la respuesta",
        { id: toastId },
      );
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    const toastId = toast.loading("Eliminando respuesta...");
    try {
      const response = await apiConnector<{
        success: boolean;
        message?: string;
      }>(
        "DELETE",
        `${subsectionDiscussionsEndpoints.DELETE_REPLY}/${replyId}`,
        undefined,
        { Authorization: `Bearer ${token}` },
      );

      if (response?.data?.success) {
        toast.success("Respuesta eliminada exitosamente", { id: toastId });
        onUpdate?.();
      } else {
        throw new Error(
          response?.data?.message || "Error al eliminar la respuesta",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Error al eliminar la respuesta",
        { id: toastId },
      );
    }
  };

  if (discussions.length === 0) {
    return (
      <div className="bg-cem-neutral-gray-50 rounded-lg p-8 text-center border border-cem-neutral-gray-100 shadow-sm">
        <p className="text-[14px] font-medium text-cem-neutral-gray-500">No hay discusiones en este curso</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((lesson) => {
        const isExpanded = expandedLessons.has(lesson.subSectionId);

        return (
          <div
            key={lesson.subSectionId}
            className="border border-cem-neutral-gray-100 rounded-lg overflow-hidden bg-white shadow-sm mb-4"
          >
            {/* Header de la lección */}
            <button
              onClick={() => toggleLesson(lesson.subSectionId)}
              className="w-full px-4 py-4 flex justify-between items-center hover:bg-cem-neutral-gray-50/50 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-[18px] font-medium text-[#1E293B] mb-1">
                  {lesson.subSectionTitle}
                </h3>
                <p className="text-[14px] font-medium text-cem-neutral-gray-400 tracking-tight">
                  {lesson.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {lesson.totalQuestions} preguntas
                  </span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                    {lesson.totalReplies} respuestas
                  </span>
                </div>
                {isExpanded ? (
                  <FiChevronDown className="text-cem-neutral-gray-400 text-xl" />
                ) : (
                  <FiChevronRight className="text-cem-neutral-gray-400 text-xl" />
                )}
              </div>
            </button>

            {/* Contenido expandido */}
            {isExpanded && (
              <div className="px-4 py-4 border-t border-cem-neutral-gray-100 bg-cem-neutral-gray-50/30 space-y-4">
                {/* Formulario para crear nueva pregunta */}
                <div className="bg-white p-4 rounded-lg border border-cem-neutral-gray-100 shadow-sm">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe una nueva pregunta..."
                      value={newQuestion[lesson.subSectionId] || ""}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          [lesson.subSectionId]: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all"
                    />
                    <button
                      onClick={() =>
                        handleCreateDiscussion(lesson.subSectionId)
                      }
                      className="px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-lg transition-colors flex items-center gap-2 font-bold shadow-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      Crear
                    </button>
                  </div>
                </div>

                {/* Lista de discusiones */}
                {lesson.discussions.length > 0 ? (
                  <div className="space-y-3">
                    {lesson.discussions.map((discussion) => {
                      const isDiscussionExpanded = expandedDiscussions.has(
                        discussion.id,
                      );

                      return (
                        <div
                          key={discussion.id}
                          className="bg-white p-4 rounded-lg border border-cem-neutral-gray-100 hover:border-cem-primary/30 transition-all shadow-sm"
                        >
                          {/* Pregunta */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-cem-neutral-gray-50 rounded-lg flex-shrink-0 border border-cem-neutral-gray-100">
                              <FiMessageSquare className="text-cem-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {editingDiscussion === discussion.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={
                                      editQuestion[discussion.id] ||
                                      discussion.question
                                    }
                                    onChange={(e) =>
                                      setEditQuestion({
                                        ...editQuestion,
                                        [discussion.id]: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary resize-none transition-all"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateDiscussion(discussion.id)
                                      }
                                      className="px-3 py-1.5 bg-cem-primary hover:bg-cem-primary-dark text-white rounded text-sm font-bold transition-colors shadow-sm"
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingDiscussion(null);
                                        setEditQuestion({
                                          ...editQuestion,
                                          [discussion.id]: "",
                                        });
                                      }}
                                      className="px-3 py-1.5 bg-cem-neutral-gray-100 hover:bg-cem-neutral-gray-200 text-cem-neutral-gray-600 rounded text-sm font-bold transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-bold text-[#1E293B] mb-2 leading-relaxed">
                                    {discussion.question}
                                  </p>
                                  <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <div className="flex items-center gap-2">
                                      <FiUser className="text-cem-neutral-gray-400 text-sm" />
                                      <span className="text-sm font-bold text-cem-neutral-gray-500">
                                        {discussion.userName}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getAccountTypeBadge(
                                          discussion.userAccountType,
                                        )}`}
                                      >
                                        {discussion.userAccountType}
                                      </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase">
                                      {formatDate(discussion.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        toggleDiscussion(discussion.id)
                                      }
                                      className="text-xs font-black uppercase tracking-wider text-cem-primary hover:text-cem-primary-dark transition-colors"
                                    >
                                      {isDiscussionExpanded
                                        ? "Ocultar respuestas"
                                        : `Ver ${(discussion as DiscussionWithReplies).replies?.length || discussion.repliesCount || 0} respuesta${((discussion as DiscussionWithReplies).replies?.length || discussion.repliesCount || 0) !== 1 ? "s" : ""}`}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingDiscussion(discussion.id);
                                        setEditQuestion({
                                          ...editQuestion,
                                          [discussion.id]: discussion.question,
                                        });
                                      }}
                                      className="text-xs font-black uppercase tracking-wider text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                                    >
                                      <FiEdit2 className="w-3 h-3" />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: "discussion",
                                          id: discussion.id,
                                        })
                                      }
                                      className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                      <FiTrash2 className="w-3 h-3" />
                                      Eliminar
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Respuestas */}
                          {isDiscussionExpanded && (
                            <div className="ml-11 mt-3 space-y-3 border-t border-cem-neutral-gray-100 pt-3">
                              {/* Formulario para crear nueva respuesta */}
                              <div className="bg-cem-neutral-gray-50 p-3 rounded-lg border border-cem-neutral-gray-100">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Escribe una respuesta..."
                                    value={newReply[discussion.id] || ""}
                                    onChange={(e) =>
                                      setNewReply({
                                        ...newReply,
                                        [discussion.id]: e.target.value,
                                      })
                                    }
                                    className="flex-1 px-3 py-2 bg-white border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all text-sm shadow-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      handleCreateReply(discussion.id)
                                    }
                                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <FiSend className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Lista de respuestas */}
                              {(discussion as DiscussionWithReplies).replies &&
                                (discussion as DiscussionWithReplies).replies!
                                  .length > 0 ? (
                                <div className="space-y-2">
                                  {(
                                    discussion as DiscussionWithReplies
                                  ).replies!.map((reply: DiscussionReply) => (
                                    <div
                                      key={reply.id}
                                      className="bg-cem-neutral-gray-50/50 p-3 rounded-lg border border-cem-neutral-gray-100"
                                    >
                                      {editingReply === reply.id ? (
                                        <div className="space-y-2">
                                          <textarea
                                            value={
                                              editReply[reply.id] || reply.reply
                                            }
                                            onChange={(e) =>
                                              setEditReply({
                                                ...editReply,
                                                [reply.id]: e.target.value,
                                              })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary resize-none transition-all text-sm"
                                            rows={2}
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() =>
                                                handleUpdateReply(reply.id)
                                              }
                                              className="px-3 py-1.5 bg-cem-primary hover:bg-cem-primary-dark text-white rounded text-sm font-bold transition-colors shadow-sm"
                                            >
                                              Guardar
                                            </button>
                                            <button
                                              onClick={() => {
                                                setEditingReply(null);
                                                setEditReply({
                                                  ...editReply,
                                                  [reply.id]: "",
                                                });
                                              }}
                                              className="px-3 py-1.5 bg-cem-neutral-gray-100 hover:bg-cem-neutral-gray-200 text-cem-neutral-gray-600 rounded text-sm font-bold transition-colors"
                                            >
                                              Cancelar
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-sm font-medium text-cem-neutral-gray-500 mb-2 leading-relaxed">
                                            {reply.reply}
                                          </p>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-cem-neutral-gray-400">
                                                {reply.userName}
                                              </span>
                                              <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getAccountTypeBadge(
                                                  reply.userAccountType,
                                                )}`}
                                              >
                                                {reply.userAccountType}
                                              </span>
                                              <span className="text-[11px] font-bold text-cem-neutral-gray-300 uppercase">
                                                {formatDate(reply.createdAt)}
                                              </span>
                                            </div>
                                            <div className="flex gap-1">
                                              <button
                                                onClick={() => {
                                                  setEditingReply(reply.id);
                                                  setEditReply({
                                                    ...editReply,
                                                    [reply.id]: reply.reply,
                                                  });
                                                }}
                                                className="text-xs font-black uppercase tracking-wider text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                                              >
                                                <FiEdit2 className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setDeleteConfirm({
                                                    type: "reply",
                                                    id: reply.id,
                                                  })
                                                }
                                                className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                              >
                                                <FiTrash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs font-bold text-cem-neutral-gray-400 text-center py-2 uppercase tracking-tight">
                                  No hay respuestas aún
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[14px] font-medium text-cem-neutral-gray-400 text-center py-4">
                    No hay discusiones en esta lección
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal de Confirmación para Eliminar */}
      {deleteConfirm && (
        <ConfirmationModal
          modalData={{
            text1:
              deleteConfirm.type === "discussion"
                ? "¿Estás seguro de que deseas eliminar esta pregunta?"
                : "¿Estás seguro de que deseas eliminar esta respuesta?",
            text2:
              deleteConfirm.type === "discussion"
                ? "Esta acción no se puede deshacer. La pregunta y todas sus respuestas serán eliminadas permanentemente."
                : "Esta acción no se puede deshacer. La respuesta será eliminada permanentemente.",
            btn1Text: "Eliminar",
            btn2Text: "Cancelar",
            btn1Handler: () => {
              if (deleteConfirm.type === "discussion") {
                handleDeleteDiscussion(deleteConfirm.id);
              } else {
                handleDeleteReply(deleteConfirm.id);
              }
              setDeleteConfirm(null);
            },
            btn2Handler: () => setDeleteConfirm(null),
          }}
        />
      )}
    </div>
  );
}
