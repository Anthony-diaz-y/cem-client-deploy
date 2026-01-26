"use client";

import { useSelector } from "react-redux";
import Home from "../Home";
import { RootState } from "@shared/store/store";
import { useHomeBackground } from "../hooks/useHomeBackground";
import { useHomeCatalogData } from "../hooks/useHomeCatalogData";

/**
 * HomeContainer - Container component for Home page
 * Minimal logic container following Scream Modular Architecture
 */
const HomeContainer = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const backgroundImg = useHomeBackground();
  const catalogPageData = useHomeCatalogData();

  return (
    <Home
      backgroundImg={backgroundImg}
      catalogPageData={catalogPageData}
      token={token}
    />
  );
};

export default HomeContainer;
