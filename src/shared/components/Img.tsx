"use client";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getImageUrl } from "../utils/imageHelper";

interface ImgProps {
  src: string | { default?: string; src?: string } | unknown;
  className?: string;
  alt?: string;
  onError?: () => void;
}

const Img: React.FC<ImgProps> = ({ src, className, alt, onError }) => {
  const imageUrl = getImageUrl(src);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(imageUrl);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setCurrentSrc(imageUrl);
  }, [imageUrl]);

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  if (!imageUrl) {
    return null;
  }

  // Show placeholder if image failed to load
  if (hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-richblack-800 text-richblack-400`}
        role="img"
        aria-label={alt || "Image placeholder"}
      >
        <svg
          className="w-1/2 h-1/2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <LazyLoadImage
      className={`${className} `}
      alt={alt || "Image"}
      effect="blur"
      src={currentSrc}
      onError={handleError}
    />
  );
};

export default Img;
