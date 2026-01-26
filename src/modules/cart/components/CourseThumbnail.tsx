// Componente presentacional para la imagen del curso con placeholder
import React, { useState } from "react";
import { HiBookOpen } from "react-icons/hi2";
import { CART_TEXTS } from "../constants/cart.constants";

interface CourseThumbnailProps {
  thumbnail?: string;
  courseName?: string;
}

export const CourseThumbnail: React.FC<CourseThumbnailProps> = ({ thumbnail, courseName }) => {
  const [imageError, setImageError] = useState(!thumbnail);

  if (!thumbnail || imageError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-richblack-800 to-richblack-900 text-richblack-400">
        <HiBookOpen size={28} className="mb-1 opacity-60" />
        <span className="text-[10px] text-center px-1">{CART_TEXTS.placeholder.noImage}</span>
      </div>
    );
  }

  return (
    <img
      src={thumbnail}
      alt={courseName || "course thumbnail"}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
};


