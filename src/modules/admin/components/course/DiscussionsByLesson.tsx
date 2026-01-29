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
      Admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Instructor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Student: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return (
      badges[type as keyof typeof badges] ||
      "bg-gray-500/20 text-gray-400 border-gray-500/30"
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
      <div className="bg-richblack-900/50 rounded-lg p-8 text-center">
        <p className="text-richblack-400">No hay discusiones en este curso</p>
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
            className="border border-richblack-700 rounded-lg overflow-hidden bg-richblack-800"
          >
            {/* Header de la lección */}
            <button
              onClick={() => toggleLesson(lesson.subSectionId)}
              className="w-full px-4 py-4 flex justify-between items-center hover:bg-richblack-900/50 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-richblack-5 mb-1">
                  {lesson.subSectionTitle}
                </h3>
                <p className="text-sm text-richblack-400">
                  {lesson.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                    {lesson.totalQuestions} preguntas
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    {lesson.totalReplies} respuestas
                  </span>
                </div>
                {isExpanded ? (
                  <FiChevronDown className="text-richblack-400 text-xl" />
                ) : (
                  <FiChevronRight className="text-richblack-400 text-xl" />
                )}
              </div>
            </button>

            {/* Contenido expandido */}
            {isExpanded && (
              <div className="px-4 py-4 border-t border-richblack-700 bg-richblack-900/30 space-y-4">
                {/* Formulario para crear nueva pregunta */}
                <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
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
                      className="flex-1 px-4 py-2 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() =>
                        handleCreateDiscussion(lesson.subSectionId)
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
                          className="bg-richblack-800 p-4 rounded-lg border border-richblack-700 hover:border-richblack-600 transition-colors"
                        >
                          {/* Pregunta */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-richblack-700 rounded-lg flex-shrink-0">
                              <FiMessageSquare className="text-richblack-400" />
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
                                    className="w-full px-3 py-2 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateDiscussion(discussion.id)
                                      }
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
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
                                      className="px-3 py-1.5 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 rounded text-sm transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-medium text-richblack-5 mb-2">
                                    {discussion.question}
                                  </p>
                                  <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <div className="flex items-center gap-2">
                                      <FiUser className="text-richblack-400 text-sm" />
                                      <span className="text-sm text-richblack-300">
                                        {discussion.userName}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${getAccountTypeBadge(
                                          discussion.userAccountType,
                                        )}`}
                                      >
                                        {discussion.userAccountType}
                                      </span>
                                    </div>
                                    <span className="text-xs text-richblack-500">
                                      {formatDate(discussion.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        toggleDiscussion(discussion.id)
                                      }
                                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
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
                                      className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
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
                                      className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
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
                            <div className="ml-11 mt-3 space-y-3 border-t border-richblack-700 pt-3">
                              {/* Formulario para crear nueva respuesta */}
                              <div className="bg-richblack-900/50 p-3 rounded-lg">
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
                                    className="flex-1 px-3 py-2 bg-richblack-800 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      handleCreateReply(discussion.id)
                                    }
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1"
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
                                      className="bg-richblack-900/50 p-3 rounded-lg border border-richblack-700"
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
                                            className="w-full px-3 py-2 bg-richblack-800 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            rows={2}
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() =>
                                                handleUpdateReply(reply.id)
                                              }
                                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
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
                                              className="px-3 py-1.5 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 rounded text-sm transition-colors"
                                            >
                                              Cancelar
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-sm text-richblack-300 mb-2">
                                            {reply.reply}
                                          </p>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-richblack-400">
                                                {reply.userName}
                                              </span>
                                              <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold border ${getAccountTypeBadge(
                                                  reply.userAccountType,
                                                )}`}
                                              >
                                                {reply.userAccountType}
                                              </span>
                                              <span className="text-xs text-richblack-500">
                                                {formatDate(reply.createdAt)}
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => {
                                                  setEditingReply(reply.id);
                                                  setEditReply({
                                                    ...editReply,
                                                    [reply.id]: reply.reply,
                                                  });
                                                }}
                                                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
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
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
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
                                <p className="text-xs text-richblack-500 text-center py-2">
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
                  <p className="text-richblack-400 text-center py-4">
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
