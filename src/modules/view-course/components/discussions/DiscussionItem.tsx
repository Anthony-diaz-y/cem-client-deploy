"use client";

import React from "react";
import { SubsectionDiscussion } from "../../types";
import { formatRelativeTime } from "../../utils/dateHelpers";
import { HiArrowLeft } from "react-icons/hi2";

interface DiscussionItemProps {
  discussion: SubsectionDiscussion;
  onDiscussionClick: (discussion: SubsectionDiscussion) => void;
}

/**
 * Componente para mostrar un elemento de discusión en la lista
 */
const DiscussionItem: React.FC<DiscussionItemProps> = ({
  discussion,
  onDiscussionClick,
}) => {
  // Obtener la última respuesta o el creador de la pregunta
  const lastReply = discussion.replies && discussion.replies.length > 0 
    ? discussion.replies[discussion.replies.length - 1]
    : null;

  const responder = lastReply?.user || discussion.user;
  const responderName = lastReply 
    ? `${responder.firstName} ${responder.lastName}`
    : `${discussion.user.firstName} ${discussion.user.lastName}`;
  
  const responderType = responder.accountType === "Instructor" ? "INSTRUCTOR" : responder.accountType.toUpperCase();
  const responseDate = lastReply?.updatedAt || lastReply?.createdAt || discussion.updatedAt || discussion.createdAt;

  return (
    <div
      onClick={() => onDiscussionClick(discussion)}
      className="bg-richblack-700 rounded-lg p-4 cursor-pointer hover:bg-richblack-600 transition-colors duration-200"
    >
      <h3 className="text-richblack-5 font-medium text-sm mb-2 line-clamp-2">
        {discussion.question}
      </h3>
      
      <div className="flex items-center gap-2 text-xs text-richblack-400">
        <HiArrowLeft className="w-3 h-3" />
        <span>
          {lastReply ? (
            <>
              <span className={responder.accountType === "Instructor" ? "text-purple-400" : ""}>
                {responderType}
              </span>
              {" "}RESPONDIÓ HACE {formatRelativeTime(responseDate).toUpperCase()}
            </>
          ) : (
            <>
              <span className={discussion.user.accountType === "Instructor" ? "text-purple-400" : ""}>
                {discussion.user.accountType.toUpperCase()}
              </span>
              {" "}CREÓ HACE {formatRelativeTime(responseDate).toUpperCase()}
            </>
          )}
        </span>
      </div>
      
      {discussion.replies && discussion.replies.length > 0 && (
        <div className="mt-3 flex justify-end">
          <div className="bg-richblack-800 text-richblack-300 text-xs px-2 py-1 rounded">
            {discussion.replies.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionItem;

