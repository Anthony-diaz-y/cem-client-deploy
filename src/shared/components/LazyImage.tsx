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

/**
 * LazyImage - Componente de imagen con lazy loading usando Intersection Observer API nativo
 * Reemplaza react-lazy-load-image-component para evitar problemas de dependencias
 */
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
    // Crear Intersection Observer
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              // Desconectar el observer una vez que la imagen está en vista
              if (observerRef.current && imgRef.current) {
                observerRef.current.unobserve(imgRef.current);
              }
            }
          });
        },
        {
          rootMargin: "50px", // Cargar 50px antes de que sea visible
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback para navegadores sin Intersection Observer
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

  // Estilos para el efecto blur
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

