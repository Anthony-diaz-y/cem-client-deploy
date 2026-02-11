"use client";

import React, { useState, useEffect } from "react";
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
import { ConfirmationModal, type ConfirmationModalData } from "@shared/components";
import {
  FaEnvelopeOpen,
  FaArchive,
  FaTrash,
  FaReply,
  FaPhone,
  FaChevronDown,
} from "react-icons/fa";

interface ContactMessagesTableProps {
  token: string;
}

/**
 * Componente para gestionar mensajes de contacto
 * Permite leer, archivar, eliminar y responder mensajes
 */
export default function ContactMessagesTable({
  token,
}: ContactMessagesTableProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchMessages();
  }, [token, sortOrder]);

  // Obtiene los mensajes desde la API según el orden seleccionado
  const fetchMessages = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params: GetMessagesParams = {
        sortOrder: sortOrder,
      };

      const result = await getContactMessages(token, params);
      setMessages(result);
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  // Marca un mensaje como leído
  const handleMarkAsRead = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await markMessageAsRead(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  // Archiva un mensaje
  const handleArchive = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await archiveMessage(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  // Desarchiva un mensaje
  const handleUnarchive = async (messageId: string) => {
    if (!token) return;

    setActionLoading(true);
    const success = await unarchiveMessage(messageId, token);
    if (success) {
      fetchMessages();
    }
    setActionLoading(false);
  };

  // Elimina un mensaje
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

  // Muestra el modal de confirmación para eliminar
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

  // Envía una respuesta a un mensaje
  const handleReply = async (messageId: string) => {
    if (!replyMessage.trim() || !token) {
      return;
    }

    setReplying(true);
    const success = await replyToMessage(messageId, replyMessage, token);
    if (success) {
      setReplyMessage("");
      fetchMessages();
    }
    setReplying(false);
  };

  // Alterna la visualización de respuestas de un mensaje
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
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-cem-neutral-gray-500 font-bold uppercase tracking-widest text-sm">
          Cargando mensajes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Selector de ordenamiento */}
      <div className="flex items-center justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
          className="px-4 py-2 text-sm bg-white border border-cem-neutral-gray-100 rounded-xl text-cem-neutral-gray-600 font-medium focus:ring-2 focus:ring-cem-primary/20 cursor-pointer outline-none shadow-sm"
        >
          <option value="DESC">Más recientes</option>
          <option value="ASC">Más antiguos</option>
        </select>
      </div>

      {/* Lista de mensajes */}
      {messages.length === 0 ? (
        <div className="text-center py-20 bg-cem-neutral-gray-50 rounded-xl">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelopeOpen className="text-2xl text-cem-neutral-gray-200" />
          </div>
          <p className="text-sm text-cem-neutral-gray-400">No tienes mensajes aún</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:shadow-cem-primary/5 ${message.replies && message.replies.length > 0
                ? "border-l-[6px] border-l-caribbeangreen-400 border-cem-neutral-gray-100"
                : !message.isRead
                  ? "border-l-[6px] border-l-yellow-400 border-cem-neutral-gray-100 ring-4 ring-yellow-400/5"
                  : "border-cem-neutral-gray-100"
                } p-8`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-black text-cem-neutral-gray-900">
                      {message.name}
                    </h3>
                    {!message.isRead && (
                      <span className="px-3 py-1 bg-yellow-400 text-richblack-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        Nuevo
                      </span>
                    )}
                    {message.replies && message.replies.length > 0 && (
                      <span className="px-3 py-1 bg-caribbeangreen-400 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        {message.replies.length}{" "}
                        {message.replies.length === 1
                          ? "respuesta"
                          : "respuestas"}
                      </span>
                    )}
                    {message.isArchived && (
                      <span className="px-3 py-1 bg-cem-neutral-gray-100 text-cem-neutral-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Archivado
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <p className="text-sm font-bold text-cem-primary hover:underline cursor-pointer">
                      {message.email}
                    </p>
                    {message.phone && (
                      <p className="text-sm text-cem-neutral-gray-500 font-medium flex items-center gap-2">
                        <FaPhone className="text-cem-primary/60" size={12} />
                        <span>{message.phone}</span>
                      </p>
                    )}
                  </div>

                  {message.subject && (
                    <div className="mt-4 inline-block px-4 py-1.5 bg-cem-celeste-light rounded-xl border border-cem-celeste-DEFAULT">
                      <p className="text-sm font-bold text-cem-primary">
                        Asunto: {message.subject}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
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
                    className={`flex-1 md:flex-none p-3 rounded-2xl transition-all duration-300 shadow-sm border ${showReplyForm === message.id
                      ? "bg-cem-primary text-white border-cem-primary shadow-cem-primary/20 scale-95"
                      : "bg-white text-cem-primary border-cem-neutral-gray-100 hover:bg-cem-primary hover:text-white"
                      } disabled:opacity-50`}
                    title="Responder"
                  >
                    <FaReply size={18} />
                  </button>

                  {!message.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      disabled={actionLoading}
                      className="flex-1 md:flex-none p-3 rounded-2xl bg-white text-caribbeangreen-400 border border-cem-neutral-gray-100 hover:bg-caribbeangreen-50 hover:border-caribbeangreen-100 transition-all shadow-sm disabled:opacity-50"
                      title="Marcar como leído"
                    >
                      <FaEnvelopeOpen size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => message.isArchived ? handleUnarchive(message.id) : handleArchive(message.id)}
                    disabled={actionLoading}
                    className={`flex-1 md:flex-none p-3 rounded-2xl border transition-all shadow-sm disabled:opacity-50 ${message.isArchived
                      ? "bg-cem-neutral-gray-900 text-white border-cem-neutral-gray-900"
                      : "bg-white text-cem-neutral-gray-600 border-cem-neutral-gray-100 hover:bg-cem-neutral-gray-50"
                      }`}
                    title={message.isArchived ? "Desarchivar" : "Archivar"}
                  >
                    <FaArchive size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(message)}
                    disabled={actionLoading}
                    className="flex-1 md:flex-none p-3 rounded-2xl bg-white text-red-500 border border-red-50 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm disabled:opacity-50"
                    title="Eliminar"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-8 p-6 bg-cem-neutral-gray-50/50 rounded-2xl border border-cem-neutral-gray-100/50">
                <p className="text-cem-neutral-gray-800 font-medium whitespace-pre-wrap leading-relaxed text-lg">
                  {message.message}
                </p>
              </div>

              {/* Respuestas colapsables */}
              {message.replies && message.replies.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleReplies(message.id)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-cem-neutral-gray-100 hover:bg-cem-neutral-gray-50/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-caribbeangreen-50 flex items-center justify-center">
                        <FaReply size={12} className="text-caribbeangreen-400" />
                      </div>
                      <span className="text-sm font-extrabold text-cem-neutral-gray-900 uppercase tracking-widest">
                        {message.replies.length}{" "}
                        {message.replies.length === 1
                          ? "Respuesta enviada"
                          : "Respuestas enviadas"}
                      </span>
                    </div>
                    <span
                      className={`text-cem-neutral-gray-400 transition-transform duration-500 ${expandedReplies.has(message.id) ? "rotate-180" : ""
                        }`}
                    >
                      <FaChevronDown size={14} />
                    </span>
                  </button>

                  {expandedReplies.has(message.id) && (
                    <div className="mt-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar animate-fadeIn">
                      {message.replies.map((reply, index) => (
                        <div
                          key={reply.id}
                          className="p-6 bg-caribbeangreen-50/20 rounded-[1.5rem] border border-caribbeangreen-100/50 border-l-4 border-l-caribbeangreen-400"
                        >
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-caribbeangreen-100/30">
                            <span className="text-[10px] font-black text-caribbeangreen-500 uppercase tracking-[0.2em]">
                              Réplica #{index + 1}
                            </span>
                            <span className="text-[10px] font-bold text-cem-neutral-gray-400">
                              {formatDateTimeUTC(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-cem-neutral-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                            {reply.replyMessage}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Formulario de respuesta */}
              {showReplyForm === message.id && (
                <div className="mb-6 p-8 bg-cem-primary/[0.03] rounded-[2rem] border-2 border-dashed border-cem-primary/20 animate-slideDown">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cem-primary text-white flex items-center justify-center">
                      <FaReply size={16} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-cem-neutral-gray-900">Responder a {message.name}</h4>
                      <p className="text-xs text-cem-neutral-gray-500 font-bold uppercase tracking-widest mt-0.5">La respuesta se enviará por correo electrónico</p>
                    </div>
                  </div>

                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Escribe tu respuesta con detalle y profesionalismo..."
                    rows={5}
                    className="w-full px-6 py-4 bg-white border border-cem-neutral-gray-100 rounded-[1.5rem] text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-300 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
                  />

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => handleReply(message.id)}
                      disabled={replying || !replyMessage.trim()}
                      className="flex-1 md:flex-none px-10 py-4 bg-cem-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                      {replying ? "Enviando..." : "Enviar Respuesta Directa"}
                    </button>
                    <button
                      onClick={() => {
                        setShowReplyForm(null);
                        setReplyMessage("");
                      }}
                      className="flex-1 md:flex-none px-8 py-4 bg-white text-cem-neutral-gray-500 border border-cem-neutral-gray-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cem-neutral-gray-50 transition-all"
                    >
                      Omitir
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-5 border-t border-cem-neutral-gray-100/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cem-neutral-gray-200"></div>
                  <span className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-widest">
                    Recibido el {formatDateTimeUTC(message.createdAt)}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-cem-neutral-gray-300 uppercase italic">
                  ID: {message.id.substring(0, 12)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

