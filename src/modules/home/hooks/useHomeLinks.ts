// Hook para manejar los links dinámicos basados en autenticación
import { useState, useEffect } from "react";
import { HOME_TEXTS } from "../constants/home.constants";

export function useHomeLinks(token: string | null) {
  // Use state to avoid hydration mismatch - only update after mount
  const [learnMoreLink, setLearnMoreLink] = useState<string>(HOME_TEXTS.links.login);

  // Update link after component mounts to avoid SSR/client mismatch
  useEffect(() => {
    setLearnMoreLink(token ? HOME_TEXTS.links.profile : HOME_TEXTS.links.login);
  }, [token]);

  return learnMoreLink;
}


