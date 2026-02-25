"use client";

import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { ConcentricCircles } from "../../home/components/shared";
import { brandColors } from "../../../shared/design-tokens";
import CategorySkeleton from "./CategorySkeleton";
import { HomeCourseCard } from "@/modules/home/components/courses/components/HomeCourseCard";
import { useCoursesData } from "../../courses/hooks/useCoursesData";
import { CoursesListSection } from "../../courses/components/coursesList/components/CoursesListSection";
import ExperienceSection from "@/modules/courses/components/experience/ExperienceSection";
import ScrollToTop from "../../../shared/components/navigation/ScrollToTop";
import { resolveCategoryIcon } from "../utils/categoryIcons";
import { getCatalogGroups } from "../services/catalogAPI";
import { getPublicLearningPaths } from "@/shared/services/learningPathAPI";
import type { CatalogGroup, Category, CoursePreview } from "../types";
import { LearningPathPublicCard } from "./LearningPathPublicCard";
import { CategorySelectionHeader } from "./CategorySelectionHeader";

/** Página principal de cursos con categorías y cursos inline */
const CategorySelectionPage: React.FC = () => {
  const [catalogGroups, setCatalogGroups] = useState<CatalogGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

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

  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  // Carga inicial de todos los dominios y categorías disponibles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [groupsData, pathsData] = await Promise.all([
        getCatalogGroups(),
        getPublicLearningPaths(),
      ]);

      setCatalogGroups(groupsData);
      setLearningPaths(pathsData);

      // Si hay grupos y no hay una selección activa, activar el primero por defecto
      if (groupsData.length > 0 && !activeGroup) {
        setActiveGroup(groupsData[0].id);
      }

      setLoading(false);
    };

    fetchData();
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

  if (loading) {
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

        {/* Content: Search Results OR Domains */}
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
            <motion.div
              key="domain-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {catalogGroups.map((group) => {
                const categoriesToShow = group.categories || [];
                if (categoriesToShow.length === 0) return null;

                // Check if selected category belongs to this domain
                const showCoursesInThisDomain =
                  selectedCategory &&
                  categoriesToShow.some(
                    (cat) => cat.id === selectedCategory.id,
                  );

                return (
                  <div key={group.id} className="mb-20">
                    <h2 className="text-4xl xl:text-[36px] font-bold xl:font-semibold text-cem-neutral-gray-900 mb-10 text-center">
                      {group.name}
                    </h2>

                    <>
                      {/* Category Cards */}
                      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                        {categoriesToShow.map((category) => (
                          <CategoryCard
                            key={category.id}
                            category={category}
                            icon={resolveCategoryIcon(
                              category.name,
                              category.icon,
                            )}
                            onClick={() => handleCategoryClick(category)}
                            isActive={selectedCategory?.id === category.id}
                            variant="default"
                          />
                        ))}
                      </div>

                      {/* Courses Section - Shows below categories when one is selected */}
                      <AnimatePresence>
                        {showCoursesInThisDomain && selectedCategory && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden mt-14"
                          >
                            <div className="mb-6">
                              <h3 className="text-2xl font-semibold text-cem-neutral-gray-900 mb-10 text-center">
                                {selectedCategory.name}
                              </h3>

                              {selectedCategory.courses &&
                                selectedCategory.courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {selectedCategory.courses.map(
                                    (course, index) => (
                                      <HomeCourseCard
                                        key={course.id}
                                        course={course}
                                        index={index}
                                        categoryName={selectedCategory.name}
                                      />
                                    ),
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-12 text-gray-500">
                                  No hay cursos disponibles en esta categoría
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  </div>
                );
              })}

              {/* Seccion de Rutas de Aprendizaje - AHORA AL FINAL */}
              {learningPaths.length > 0 && (
                <div className="mt-28 mb-20 px-4">
                  <h2 className="text-3xl lg:text-[42px] font-bold text-cem-neutral-gray-900 mb-16 text-center tracking-tight">
                    Rutas de aprendizaje
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1300px] mx-auto">
                    {learningPaths.map((path) => (
                      <div key={path.id} className="flex justify-center">
                        <LearningPathPublicCard learningPath={path} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nueva sección: Todos los cursos (cuando no hay categoría seleccionada) */}
              {!selectedCategory && (
                <div className="mt-20">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4">
                      Nuestros cursos y programas
                    </h2>
                    <p className="text-cem-neutral-gray-500 max-w-2xl mx-auto">
                      Cursos y programas para impulsar tu carrera en ciencias,
                      con videos y recursos flexibles.
                    </p>
                  </div>

                  {loadingSearch ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CategorySkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {searchResults.map((course, index) => (
                          <HomeCourseCard
                            key={course.id}
                            course={course}
                            index={index}
                          />
                        ))}
                      </div>

                      {/* Paginación simple si es necesario o un link a ver más */}
                      {meta && meta.totalPages && meta.totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setPage(page - 1)}
                              disabled={page === 1}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                              Anterior
                            </button>
                            <span className="font-medium text-cem-neutral-gray-700">
                              Página {page} de {meta.totalPages}
                            </span>
                            <button
                              onClick={() => setPage(page + 1)}
                              disabled={page === meta.totalPages}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ExperienceSection />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default CategorySelectionPage;
