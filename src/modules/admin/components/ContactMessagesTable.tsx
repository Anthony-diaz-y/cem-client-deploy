"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import {
  getContactMessages,
  markMessageAsRead,
  archiveMessage,
  unarchiveMessage,
  deleteContactMessage,
  replyToMessage,
  ContactMessage,
  GetMessagesParams,
} from "@shared/services/contactAPI";
import { formatDateTimeUTC } from "@shared/utils/formatDate";
import ConfirmationModal, {
  ConfirmationModalData,
} from "@shared/components/ConfirmationModal";
import {
  FaEnvelopeOpen,
  FaArchive,
  FaTrash,
  FaReply,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface ContactMessagesTableProps {
  token: string;
}

export default function ContactMessagesTable({
  token,
}: ContactMessagesTableProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "unread" | "replied" | "archived"
  >("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Nuevos estados para filtros y respuesta
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchMessages();
  }, [filter, token, sortOrder]);

  const fetchMessages = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params: GetMessagesParams = {};

      if (filter === "unread") {
        params.isRead = false;
        params.isArchived = false;
      } else if (filter === "replied") {
        params.isReplied = true;
      } else if (filter === "archived") {
        params.isArchived = true;
      }

      if (sortOrder) {
        params.sortOrder = sortOrder;
      }

      const result = await getContactMessages(token, params);
      setMessages(result);
    } catch (error) {
      // El error ya se maneja en getContactMessages
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await markMessageAsRead(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  const handleArchive = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await archiveMessage(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  const handleUnarchive = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await unarchiveMessage(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  const handleDelete = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await deleteContactMessage(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
    setConfirmationModal(null);
  };

  const handleDeleteClick = (message: ContactMessage) => {
    setConfirmationModal({
      text1: "¿Eliminar este mensaje?",
      text2: "Esta acción no se puede deshacer.",
      btn1Text: "Eliminar",
      btn2Text: "Cancelar",
      btn1Handler: () => handleDelete(message.id),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleReply = async (messageId: string) => {
    if (!replyMessage.trim() || !token) {
      return;
    }

    setReplying(true);
    const success = await replyToMessage(messageId, replyMessage, token);
    if (success) {
      setReplyMessage("");
      // No cerrar el formulario, permitir múltiples respuestas
      fetchMessages(); // Recargar para obtener la nueva respuesta
    }
    setReplying(false);
  };

  const clearFilters = () => {
    setSortOrder("DESC");
    setFilter("all");
  };

  const toggleReplies = (messageId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="text-center text-richblack-300 py-8">
        Cargando mensajes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros principales */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            filter === "all"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            filter === "unread"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          No Leídos
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            filter === "replied"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          Respondidos
        </button>
        <button
          onClick={() => setFilter("archived")}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            filter === "archived"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          Archivados
        </button>
      </div>

      {/* Filtros avanzados */}
      <div className="bg-richblack-800 rounded-lg p-4 border border-richblack-700">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Ordenar por
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
              className="w-full px-3 py-2 bg-richblack-900 border border-richblack-700 rounded-md text-richblack-200 focus:outline-none focus:ring-2 focus:ring-yellow-50"
            >
              <option value="DESC">Más recientes primero</option>
              <option value="ASC">Más antiguos primero</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-richblack-700 text-richblack-300 rounded-md hover:bg-richblack-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de mensajes */}
      {messages.length === 0 ? (
        <div className="text-center text-richblack-300 py-8 bg-richblack-800 rounded-lg">
          No hay mensajes{" "}
          {filter === "unread"
            ? "no leídos"
            : filter === "archived"
            ? "archivados"
            : ""}
          .
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-richblack-800 rounded-lg border ${
                message.replies && message.replies.length > 0
                  ? "border-l-4 border-l-caribbeangreen-200"
                  : !message.isRead
                  ? "border-l-4 border-l-yellow-50 bg-richblack-800/50"
                  : "border-richblack-700"
              } p-6 transition-all hover:shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-richblack-5">
                      {message.name}
                    </h3>
                    {!message.isRead && (
                      <span className="px-2 py-0.5 bg-yellow-50 text-richblack-900 text-xs font-bold rounded-full">
                        Nuevo
                      </span>
                    )}
                    {message.replies && message.replies.length > 0 && (
                      <span className="px-2 py-0.5 bg-caribbeangreen-200 text-richblack-900 text-xs font-bold rounded-full">
                        {message.replies.length}{" "}
                        {message.replies.length === 1
                          ? "respuesta"
                          : "respuestas"}
                      </span>
                    )}
                    {message.isArchived && (
                      <span className="px-2 py-0.5 bg-richblack-600 text-richblack-300 text-xs font-medium rounded-full">
                        Archivado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-richblack-300">{message.email}</p>
                  {message.phone && (
                    <p className="text-sm text-richblack-300 mt-1 flex items-center gap-2">
                      <FaPhone size={12} />
                      <span>{message.phone}</span>
                    </p>
                  )}
                  {message.subject && (
                    <p className="text-sm font-medium text-richblack-200 mt-1">
                      Asunto: {message.subject}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setShowReplyForm(
                        showReplyForm === message.id ? null : message.id
                      );
                      if (showReplyForm !== message.id) {
                        setReplyMessage("");
                      }
                    }}
                    disabled={actionLoading}
                    className="p-2 rounded-md bg-richblack-700 text-caribbeangreen-200 hover:bg-richblack-600 transition-colors disabled:opacity-50"
                    title={
                      message.replies && message.replies.length > 0
                        ? "Agregar otra respuesta"
                        : "Responder"
                    }
                  >
                    <FaReply size={16} />
                  </button>
                  {!message.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      disabled={actionLoading}
                      className="p-2 rounded-md bg-richblack-700 text-caribbeangreen-200 hover:bg-richblack-600 transition-colors disabled:opacity-50"
                      title="Marcar como leído"
                    >
                      <FaEnvelopeOpen size={16} />
                    </button>
                  )}
                  {message.isArchived ? (
                    <button
                      onClick={() => handleUnarchive(message.id)}
                      disabled={actionLoading}
                      className="p-2 rounded-md bg-richblack-700 text-blue-300 hover:bg-richblack-600 transition-colors disabled:opacity-50"
                      title="Desarchivar"
                    >
                      <FaArchive size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchive(message.id)}
                      disabled={actionLoading}
                      className="p-2 rounded-md bg-richblack-700 text-blue-300 hover:bg-richblack-600 transition-colors disabled:opacity-50"
                      title="Archivar"
                    >
                      <FaArchive size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(message)}
                    disabled={actionLoading}
                    className="p-2 rounded-md bg-richblack-700 text-pink-300 hover:bg-richblack-600 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-richblack-200 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>

              {/* Respuestas colapsables */}
              {message.replies && message.replies.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleReplies(message.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-richblack-900/50 rounded-lg border border-richblack-700 hover:bg-richblack-900 transition-colors"
                  >
                    <span className="text-sm font-semibold text-richblack-200">
                      {expandedReplies.has(message.id) ? "Ocultar" : "Ver"}{" "}
                      {message.replies.length}{" "}
                      {message.replies.length === 1
                        ? "Respuesta"
                        : "Respuestas"}
                    </span>
                    <span
                      className={`text-richblack-400 transition-transform duration-300 ${
                        expandedReplies.has(message.id) ? "rotate-180" : ""
                      }`}
                    >
                      <FaChevronDown size={14} />
                    </span>
                  </button>
                  {expandedReplies.has(message.id) && (
                    <div className="mt-3 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                      {message.replies.map((reply, index) => (
                        <div
                          key={reply.id}
                          className="p-4 bg-richblack-900/50 rounded-lg border border-richblack-700 border-l-4 border-l-yellow-50"
                        >
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-richblack-700">
                            <span className="text-xs font-bold text-yellow-50">
                              Respuesta #{index + 1}
                            </span>
                            <span className="text-xs text-richblack-400">
                              {formatDateTimeUTC(reply.createdAt)}
                            </span>
                          </div>
                          <div className="bg-richblack-800 p-3 rounded-md mt-2">
                            <p className="text-richblack-200 whitespace-pre-wrap leading-relaxed">
                              {reply.replyMessage}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Formulario de respuesta (siempre visible cuando se expande) */}
              {showReplyForm === message.id && (
                <div className="mb-4 p-4 bg-richblack-900 rounded-lg border border-richblack-700">
                  <label className="block text-sm font-medium text-richblack-300 mb-2">
                    Escribe tu respuesta:
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                    className="w-full px-3 py-2 bg-richblack-800 border border-richblack-700 rounded-md text-richblack-200 placeholder-richblack-500 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReply(message.id)}
                      disabled={replying || !replyMessage.trim()}
                      className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replying ? "Enviando..." : "Enviar Respuesta"}
                    </button>
                    <button
                      onClick={() => {
                        setShowReplyForm(null);
                        setReplyMessage("");
                      }}
                      className="px-4 py-2 bg-richblack-700 text-richblack-300 rounded-md hover:bg-richblack-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-richblack-400 pt-4 border-t border-richblack-700">
                <span>{formatDateTimeUTC(message.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}
