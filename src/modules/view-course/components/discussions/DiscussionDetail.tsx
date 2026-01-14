"use client";

import React, { useState } from "react";
import { SubsectionDiscussion } from "../../types";
import { formatRelativeTime } from "../../utils/dateHelpers";
import {
  createReply,
  updateReply,
  deleteReply,
  updateDiscussion,
  deleteDiscussion,
} from "../../services/discussionAPI";
import ReplyItem from "./ReplyItem";
import ReplyForm from "./ReplyForm";
import EditDiscussionForm from "./EditDiscussionForm";
import Img from "@shared/components/Img";
import { HiArrowLeft, HiPencil, HiTrash } from "react-icons/hi2";

interface DiscussionDetailProps {
  discussion: SubsectionDiscussion;
  currentUserId: string;
  onBack: () => void;
  onUpdate: () => void;
  onDiscussionUpdate?: (updatedDiscussion: SubsectionDiscussion) => void;
}

/**
 * Función helper para obtener el estilo del badge según el rol
 */
const getRoleBadgeStyle = (accountType: 'Admin' | 'Instructor' | 'Student') => {
  switch (accountType) {
    case 'Instructor':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'Admin':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'Student':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-richblack-600 text-richblack-300 border-richblack-500';
  }
};

/**
 * Componente para mostrar los detalles de una discusión con sus respuestas
 * Diseño compacto y elegante
 * Actualizado para usar la discusión completa devuelta por el backend
 */
const DiscussionDetail: React.FC<DiscussionDetailProps> = ({
  discussion,
  currentUserId,
  onBack,
  onUpdate,
  onDiscussionUpdate,
}) => {
  const [currentDiscussion, setCurrentDiscussion] = useState<SubsectionDiscussion>(discussion);
  const [isEditingDiscussion, setIsEditingDiscussion] = useState(false);
  const [isEditingReply, setIsEditingReply] = useState<string | null>(null);

  // Actualizar la discusión local cuando cambia el prop
  React.useEffect(() => {
    setCurrentDiscussion(discussion);
  }, [discussion]);

  const canEditDiscussion = currentDiscussion.userId === currentUserId;
  const canDeleteDiscussion = currentDiscussion.userId === currentUserId;

  const handleDeleteDiscussion = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) {
      return;
    }

    const success = await deleteDiscussion(currentDiscussion.id);
    if (success) {
      onUpdate();
    }
  };

  const handleReplySuccess = async (updatedDiscussion: SubsectionDiscussion) => {
    setCurrentDiscussion(updatedDiscussion);
    if (onDiscussionUpdate) {
      onDiscussionUpdate(updatedDiscussion);
    }
    onUpdate();
  };

  const handleReplyUpdate = (updatedDiscussion: SubsectionDiscussion) => {
    setCurrentDiscussion(updatedDiscussion);
    setIsEditingReply(null);
    if (onDiscussionUpdate) {
      onDiscussionUpdate(updatedDiscussion);
    }
    onUpdate();
  };

  const handleReplyDelete = async (replyId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta respuesta?")) {
      return;
    }

    const updatedDiscussion = await deleteReply(replyId);
    if (updatedDiscussion) {
      setCurrentDiscussion(updatedDiscussion);
      if (onDiscussionUpdate) {
        onDiscussionUpdate(updatedDiscussion);
      }
      onUpdate();
    }
  };

  if (isEditingDiscussion) {
    return (
      <EditDiscussionForm
        discussion={currentDiscussion}
        onCancel={() => setIsEditingDiscussion(false)}
        onSuccess={(updatedDiscussion) => {
          setCurrentDiscussion(updatedDiscussion);
          setIsEditingDiscussion(false);
          if (onDiscussionUpdate) {
            onDiscussionUpdate(updatedDiscussion);
          }
          onUpdate();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con botón volver */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-richblack-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-richblack-400 hover:text-richblack-100 mb-3 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>

        {/* Pregunta - diseño compacto */}
        <div className="bg-richblack-700/50 rounded-lg p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex gap-2 flex-1 min-w-0">
              <Img
                src={currentDiscussion.user.image}
                alt={`${currentDiscussion.user.firstName} ${currentDiscussion.user.lastName}`}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-richblack-5 truncate">
                  {currentDiscussion.user.firstName} {currentDiscussion.user.lastName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getRoleBadgeStyle(currentDiscussion.user.accountType)}`}>
                    {currentDiscussion.user.accountType.toUpperCase()}
                  </span>
                  <span className="text-xs text-richblack-400">
                    {formatRelativeTime(currentDiscussion.createdAt).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {(canEditDiscussion || canDeleteDiscussion) && (
              <div className="flex gap-1 flex-shrink-0">
                {canEditDiscussion && (
                  <button
                    onClick={() => setIsEditingDiscussion(true)}
                    className="text-richblack-400 hover:text-yellow-50 transition-colors p-1 rounded"
                    aria-label="Editar pregunta"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                )}
                {canDeleteDiscussion && (
                  <button
                    onClick={handleDeleteDiscussion}
                    className="text-richblack-400 hover:text-red-400 transition-colors p-1 rounded"
                    aria-label="Eliminar pregunta"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-richblack-5 leading-relaxed whitespace-pre-wrap break-words mt-2">
            {currentDiscussion.question}
          </p>
        </div>
      </div>

      {/* Respuestas - diseño compacto */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        {currentDiscussion.replies && currentDiscussion.replies.length > 0 ? (
          <>
            <div className="text-xs font-semibold text-richblack-400 uppercase tracking-wide mb-3">
              {currentDiscussion.replies.length} {currentDiscussion.replies.length === 1 ? 'RESPUESTA' : 'RESPUESTAS'}
            </div>
            <div className="space-y-0">
              {currentDiscussion.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  currentUserId={currentUserId}
                  isEditing={isEditingReply === reply.id}
                  onEdit={() => setIsEditingReply(reply.id)}
                  onCancelEdit={() => setIsEditingReply(null)}
                  onUpdate={handleReplyUpdate}
                  onDelete={() => handleReplyDelete(reply.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-richblack-400 text-sm">
            No hay respuestas aún. Sé el primero en responder.
          </div>
        )}
      </div>

      {/* Formulario de respuesta */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-richblack-700 bg-richblack-800/50">
        <ReplyForm
          discussionId={currentDiscussion.id}
          onSuccess={handleReplySuccess}
        />
      </div>
    </div>
  );
};

export default DiscussionDetail;
