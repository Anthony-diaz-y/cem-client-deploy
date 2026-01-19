/**
 * Hook personalizado para manejar scroll automático durante drag & drop
 * Hace scroll cuando el usuario arrastra cerca de los bordes de la ventana
 */

import { useEffect, useRef, useCallback } from "react";

interface UseAutoScrollProps {
  isDragging: boolean;
  scrollSpeed?: number;
  scrollThreshold?: number;
}

const DEFAULT_SCROLL_SPEED = 10;
const DEFAULT_SCROLL_THRESHOLD = 100;

export function useAutoScroll({
  isDragging,
  scrollSpeed = DEFAULT_SCROLL_SPEED,
  scrollThreshold = DEFAULT_SCROLL_THRESHOLD,
}: UseAutoScrollProps) {
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
        return;
      }

      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;
      
      // Usar window scroll (más confiable para páginas completas)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const clientHeight = window.innerHeight;
      
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      // Limpiar intervalo anterior
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      // Scroll hacia arriba (arrastrando cerca del borde superior)
      if (mouseY < scrollThreshold && !isAtTop) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: -scrollSpeed, behavior: "auto" });
        }, 16); // ~60fps
      }
      // Scroll hacia abajo (arrastrando cerca del borde inferior)
      else if (mouseY > viewportHeight - scrollThreshold && !isAtBottom) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: scrollSpeed, behavior: "auto" });
        }, 16); // ~60fps
      }
    },
    [isDragging, scrollSpeed, scrollThreshold]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      };
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  }, [isDragging, handleMouseMove]);

  return { containerRef };
}

