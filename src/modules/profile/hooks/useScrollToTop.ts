// Hook para hacer scroll al top cuando el componente se monta
import { useEffect } from "react";

export function useScrollToTop() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);
}


