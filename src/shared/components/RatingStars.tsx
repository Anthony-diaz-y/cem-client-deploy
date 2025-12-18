import React, { useEffect, useState } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

interface RatingStarsProps {
  Review_Count: number;
  Star_Size?: number;
}

function RatingStars({ Review_Count, Star_Size = 20 }: RatingStarsProps) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  });

  useEffect(() => {
    // Limitar el valor a un rango válido entre 0 y 5
    const clampedRating = Math.max(0, Math.min(5, Review_Count || 0));
    const wholeStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating - wholeStars >= 0.5;
    
    SetStarCount({
      full: wholeStars,
      half: hasHalfStar ? 1 : 0,
      empty: hasHalfStar ? 5 - wholeStars - 1 : 5 - wholeStars,
    });
  }, [Review_Count]);

  // return (
  //   <div className="flex gap-1 text-yellow-100">
  //     {[...new Array(starCount.full)].map((_, i) => {
  //       return <TiStarFullOutline key={i} size={Star_Size || 20} />
  //     })}
  //     {[...new Array(starCount.half)].map((_, i) => {
  //       return <TiStarHalfOutline key={i} size={Star_Size || 20} />
  //     })}
  //     {[...new Array(starCount.empty)].map((_, i) => {
  //       return <TiStarOutline key={i} size={Star_Size || 20} />
  //     })}
  //   </div>
  // )

  // Asegurar que siempre tengamos exactamente 5 estrellas
  const totalStars = starCount.full + starCount.half + starCount.empty;
  const finalStarCount = {
    full: Math.max(0, Math.min(5, starCount.full)),
    half: Math.max(0, Math.min(1, starCount.half)),
    empty: Math.max(0, Math.min(5, 5 - starCount.full - starCount.half)),
  };

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...new Array(finalStarCount.full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={Star_Size || 20} />
      ))}
      {[...new Array(finalStarCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`half-${i}`} size={Star_Size || 20} />
      ))}
      {[...new Array(finalStarCount.empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={Star_Size || 20} />
      ))}
    </div>
  );
}

export default RatingStars;
