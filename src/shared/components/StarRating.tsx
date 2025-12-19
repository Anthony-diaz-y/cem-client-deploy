"use client";

import React, { useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";

interface StarRatingProps {
  rating: number; // 0-5
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  starSize?: number;
  className?: string;
}

/**
 * StarRating - Componente interactivo para seleccionar y mostrar calificaciones con estrellas
 * @param rating - Calificación actual (0-5)
 * @param onRatingChange - Callback cuando se cambia la calificación (solo si no es readonly)
 * @param readonly - Si es true, no se puede interactuar con las estrellas
 * @param starSize - Tamaño de las estrellas (default: 24)
 * @param className - Clases CSS adicionales
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  readonly = false,
  starSize = 24,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  // Determinar qué estrellas están llenas basándose en hover o rating
  const displayRating = hoverRating || rating;

  return (
    <div className={`flex gap-1 items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`transition-all duration-200 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } ${isFilled ? "text-yellow-50" : "text-richblack-500"}`}
            role="button"
            tabIndex={readonly ? -1 : 0}
            aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
          >
            {isFilled ? (
              <TiStarFullOutline size={starSize} className="fill-current" />
            ) : (
              <TiStarOutline size={starSize} className="fill-current" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

