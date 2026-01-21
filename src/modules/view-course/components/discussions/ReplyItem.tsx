"use client";

import React from "react";
import { SubsectionDiscussionReply } from "../../types";
import { formatRelativeTime } from "../../utils/dateHelpers";
import { Img } from "@shared/components";
import { HiPencil, HiTrash } from "react-icons/hi2";
import EditReplyForm from "./EditReplyForm";
import type { SubsectionDiscussion } from "../../types";

interface ReplyItemProps {
  reply: SubsectionDiscussionReply;
  currentUserId: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updatedDiscussion: SubsectionDiscussion) => void;
  onDelete: () => void;
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
 * Componente para mostrar una respuesta individual - diseño compacto y elegante
 * Actualizado para usar la discusión completa devuelta por el backend
 */
const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  currentUserId,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) => {
  const canEdit = reply.userId === currentUserId;
  const canDelete = reply.userId === currentUserId;

  if (isEditing) {
    return (
      <EditReplyForm
        reply={reply}
        onCancel={onCancelEdit}
        onSuccess={(updatedDiscussion) => {
          onUpdate(updatedDiscussion);
        }}
      />
    );
  }

  return (
    <div className="pb-4 border-b border-richblack-700/50 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Img
            src={reply.user.image}
            alt={`${reply.user.firstName} ${reply.user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Información del usuario */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-richblack-5 truncate">
                {reply.user.firstName} {reply.user.lastName}
              </p>
              {/* Badge de rol */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded border ${getRoleBadgeStyle(reply.user.accountType)}`}>
                  {reply.user.accountType.toUpperCase()}
                </span>
                <span className="text-xs text-richblack-400">
                  {formatRelativeTime(reply.createdAt).toUpperCase()}
                  {reply.updatedAt !== reply.createdAt && (
                    <span className="ml-1">(EDITADO)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            {(canEdit || canDelete) && (
              <div className="flex gap-1 flex-shrink-0">
                {canEdit && (
                  <button
                    onClick={onEdit}
                    className="text-richblack-400 hover:text-yellow-50 transition-colors p-1 rounded"
                    aria-label="Editar respuesta"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={onDelete}
                    className="text-richblack-400 hover:text-red-400 transition-colors p-1 rounded"
                    aria-label="Eliminar respuesta"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Texto de la respuesta */}
          <p className="text-sm text-richblack-300 leading-relaxed whitespace-pre-wrap break-words mt-2">
            {reply.reply}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
