"use client";

import { useSelector } from "react-redux";
import Home from "../Home";
import { RootState } from "@shared/store/store";
import { useHomeCatalogData } from "../hooks/useHomeCatalogData";
import { HERO_CONTENT } from "../constants/hero.constants";

/**
 * HomeContainer - Container component for Home page
 * Minimal logic container following Scream Modular Architecture
 */
const HomeContainer = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { courses, loading, error } = useHomeCatalogData();

  return (
    <Home
      courses={courses}
      token={token}
      hero={HERO_CONTENT}
      coursesLoading={loading}
      coursesError={error}
    />
  );
};

export default HomeContainer;
