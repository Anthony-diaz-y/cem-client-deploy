"use client";

import React, { useEffect, useState } from "react";
import type { Domain, Category } from "../types";
import { getAllDomains } from "../services/domainsAPI";
import { motion, AnimatePresence } from "framer-motion";
import { ConcentricCircles } from "../../home/components/shared";
import { brandColors } from "../../../shared/design-tokens";
import CategorySkeleton from "./CategorySkeleton";
import { useCoursesData } from "../../courses/hooks/useCoursesData";
import { CoursesListSection } from "../../courses/components/coursesList/components/CoursesListSection";
import ExperienceSection from "@/modules/courses/components/experience/ExperienceSection";
import ScrollToTop from "../../../shared/components/navigation/ScrollToTop";
import { CategorySelectionHeader } from "./CategorySelectionHeader";
import { DomainsSection } from "./DomainsSection";

const CategorySelectionPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const {
    courses: searchResults,
    loading: loadingSearch,
    search,
    setSearch,
    page,
    setPage,
    meta,
  } = useCoursesData();

  const [localSearchQuery, setLocalSearchQuery] = useState(search || "");

  useEffect(() => {
    setLocalSearchQuery(search || "");
  }, [search]);

  useEffect(() => {
    const fetchDomains = async () => {
      setLoadingDomains(true);
      const data = await getAllDomains();
      setDomains(data);
      setLoadingDomains(false);
    };
    fetchDomains();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearchQuery);
    if (localSearchQuery) {
      setSelectedCategory(null);
    }
  };

  if (loadingDomains) {
    return (
      <div className="min-h-screen bg-cem-neutral-white relative mt-20 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-[67px] font-bold text-cem-neutral-gray-900 mb-16 leading-[1.26]">
              Nuestros cursos para <br /> crecer en{" "}
              <span className="text-cem-primary relative">ciencia</span>
            </h1>
          </div>
          <CategorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cem-neutral-white mt-20 relative overflow-hidden">
      <ConcentricCircles
        size={500}
        circles={3}
        borderColor={brandColors.primary.light}
        dotColor={brandColors.primary.DEFAULT}
        showDot={true}
        className="absolute right-0 top-0 hidden md:block opacity-60 pointer-events-none translate-x-[20%]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={search ? "search-header" : "main-header"}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CategorySelectionHeader
              search={search}
              localSearchQuery={localSearchQuery}
              onSearchChange={setLocalSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              onBackToCategories={() => setSearch("")}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {search ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CoursesListSection
                courses={searchResults}
                loading={loadingSearch}
                page={page}
                limit={9}
                meta={meta}
                onPageChange={setPage}
                hideHeader={true}
              />
            </motion.div>
          ) : (
            <DomainsSection
              domains={domains}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </AnimatePresence>

        <ExperienceSection />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default CategorySelectionPage;
