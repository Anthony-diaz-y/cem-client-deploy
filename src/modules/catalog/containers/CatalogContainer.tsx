"use client";

import React from "react";
import Footer from "../../../shared/components/Footer";
import CatalogHero from "../components/CatalogHero";
import CatalogTabs from "../components/CatalogTabs";
import CatalogSections from "../components/CatalogSections";
import CatalogLoadingState from "../components/CatalogLoadingState";
import CatalogEmptyState from "../components/CatalogEmptyState";
import { useCatalogData } from "../hooks/useCatalogData";
import { useCatalogTabs } from "../hooks/useCatalogTabs";

/**
 * CatalogContainer - Container component for Catalog page
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
const CatalogContainer = () => {
  const { catalogPageData, loading } = useCatalogData();
  const { active, setActiveTab } = useCatalogTabs(1);

  // Loading state
  if (loading) {
    return <CatalogLoadingState />;
  }

  // No data state
  if (!loading && !catalogPageData) {
    return <CatalogEmptyState />;
  }

  // Render presentational components with data
  return (
    <>
      <CatalogHero catalogPageData={catalogPageData!} />
      <CatalogTabs
        catalogPageData={catalogPageData!}
        active={active}
        onTabChange={setActiveTab}
      />
      <CatalogSections catalogPageData={catalogPageData!} />
      <Footer />
    </>
  );
};

export default CatalogContainer;
