// Hook para manejar el skeleton loading con delay mínimo
import { useState, useEffect, useRef } from "react";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

interface UseSkeletonLoadingProps {
  loading: boolean;
  hasData: boolean;
}

export function useSkeletonLoading({ loading, hasData }: UseSkeletonLoadingProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasEverLoadedRef = useRef(hasData);

  useEffect(() => {
    if (loading && !hasEverLoadedRef.current) {
      // Iniciar timer solo si nunca se han cargado datos
      timeoutRef.current = setTimeout(() => {
        // Solo mostrar skeleton si todavía está cargando después del delay mínimo
        if (loading) {
          setShowSkeleton(true);
        }
      }, INSTRUCTOR_TEXTS.loading.minLoadingTime);
    } else {
      // Si terminó de cargar o ya hay datos, ocultar skeleton inmediatamente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowSkeleton(false);

      if (hasData) {
        hasEverLoadedRef.current = true;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, hasData]);

  return showSkeleton;
}

