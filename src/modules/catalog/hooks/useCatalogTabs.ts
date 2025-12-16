import { useState } from "react";

/**
 * Custom hook to manage catalog tabs state
 * Separates tab state logic from component
 */
export const useCatalogTabs = (initialTab: number = 1) => {
  const [active, setActive] = useState(initialTab);

  const setActiveTab = (tab: number) => {
    setActive(tab);
  };

  return { active, setActiveTab };
};
