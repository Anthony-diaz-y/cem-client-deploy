// Hook para hacer scroll al top de la página al montar el componente
import { useEffect } from "react";

export function useScrollToTop() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);
}


