"use client";

import React from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";

interface DiscussionButtonProps {
  onClick: () => void;
  discussionCount?: number;
}

/**
 * Botón para abrir el sidebar de discusiones
 * Se muestra arriba a la derecha del video
 * Muestra la cantidad de discusiones de forma elegante
 */
const DiscussionButton: React.FC<DiscussionButtonProps> = ({
  onClick,
  discussionCount = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 border border-richblack-600 text-richblack-100 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Abrir discusiones"
    >
      <HiChatBubbleLeftRight className="w-5 h-5" />
      <span className="text-sm font-medium">
        <span className="text-richblack-300 mr-1">{discussionCount}</span>
        Discusiones
      </span>
    </button>
  );
};

export default DiscussionButton;
