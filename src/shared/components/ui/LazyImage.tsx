"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  effect?: "blur" | "opacity" | "black-and-white";
  onError?: () => void;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = "Image",
  className = "",
  effect = "blur",
  onError,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observerRef.current && imgRef.current) {
                observerRef.current.unobserve(imgRef.current);
              }
            }
          });
        },
        {
          rootMargin: "50px",
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      setIsInView(true);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  const blurStyle: React.CSSProperties =
    effect === "blur" && !isLoaded
      ? {
          filter: "blur(5px)",
          transition: "filter 0.3s",
        }
      : {};

  const opacityStyle: React.CSSProperties =
    effect === "opacity"
      ? {
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s",
        }
      : {};

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      className={className}
      style={{
        ...style,
        ...blurStyle,
        ...opacityStyle,
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default LazyImage;

