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

      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      if (mouseY < scrollThreshold && !isAtTop) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: -scrollSpeed, behavior: "auto" });
        }, 16);
      }
      else if (mouseY > viewportHeight - scrollThreshold && !isAtBottom) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: scrollSpeed, behavior: "auto" });
        }, 16);
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


