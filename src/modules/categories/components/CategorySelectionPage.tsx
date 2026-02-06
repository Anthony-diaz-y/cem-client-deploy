"use client";

import React, { useEffect, useState } from "react";
import { Domain, Category } from "../types";
import { getAllDomains } from "../services/domainsAPI";
import CategoryCard from "./CategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { ConcentricCircles } from "../../home/components/shared";
import { brandColors } from "../../../shared/design-tokens";
import {
  GiMicroscope,
  GiWheat,
  GiHealthNormal,
  GiChemicalDrop,
} from "react-icons/gi";
import CategorySkeleton from "./CategorySkeleton";
import LearningPathCard from "./LearningPathCard";
import { HomeCourseCard } from "@/modules/home/components/courses/components/HomeCourseCard";
import { useCoursesData } from "../../courses/hooks/useCoursesData";
import { FiSearch } from "react-icons/fi";
import { CoursesListSection } from "../../courses/components/coursesList/components/CoursesListSection";
import ExperienceSection from "@/modules/courses/components/experience/ExperienceSection";
import Footer from "../../../shared/components/navigation/Footer";
import ScrollToTop from "../../../shared/components/navigation/ScrollToTop";

/** Asigna iconos por defecto según palabras clave en el nombre de la categoría */
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("biología") || name.includes("biotecnología"))
    return <GiMicroscope />;
  if (name.includes("agropecuaria") || name.includes("veterinaria"))
    return <GiWheat />;
  if (name.includes("salud")) return <GiHealthNormal />;
  if (name.includes("alimento")) return <GiChemicalDrop />;
  return <GiMicroscope />;
};

/** Página principal de cursos con categorías y cursos inline */
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

  // Sincronizar búsqueda local con la de la URL (por ejemplo si se borra el filtro)
  useEffect(() => {
    setLocalSearchQuery(search || "");
  }, [search]);

  // Carga inicial de todos los dominios y categorías disponibles
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
    // Si la misma categoría está seleccionada, deseleccionarla
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
      setSelectedCategory(null); // Limpiar categoría seleccionada al buscar
    }
  };

  if (loadingDomains) {
    return (
      <div className="min-h-screen bg-cem-neutral-white relative mt-20 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
              Nuestros cursos para crecer en{" "}
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
      {/* Decoración de fondo: Círculos Concéntricos */}
      <ConcentricCircles
        size={500}
        circles={3}
        borderColor={brandColors.primary.light}
        dotColor={brandColors.primary.DEFAULT}
        showDot={true}
        className="absolute right-0 top-0 hidden md:block opacity-60 pointer-events-none translate-x-[20%]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header - Conditionally rendered based on search state */}
        <AnimatePresence mode="wait">
          {!search ? (
            <motion.div
              key="main-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
                Nuestros cursos para crecer en{" "}
                <span className="text-cem-primary relative">ciencia</span>
              </h1>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center w-full bg-white border border-cem-neutral-gray-200 rounded-full shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-cem-primary/10 focus-within:border-cem-primary transition-all"
                >
                  <div className="pl-6 text-cem-neutral-gray-400 group-focus-within:text-cem-primary transition-colors">
                    <FiSearch size={22} />
                  </div>
                  <input
                    type="text"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    placeholder="¿Qué quieres aprender hoy?"
                    className="flex-1 pl-4 pr-4 py-4 bg-transparent outline-none text-lg text-cem-neutral-gray-800 placeholder:text-cem-neutral-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-cem-neutral-gray-50 border-l border-cem-neutral-gray-200 text-cem-neutral-gray-700 font-medium hover:bg-cem-neutral-gray-100 transition-colors"
                  >
                    Buscar
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <button
                onClick={() => setSearch("")}
                className="flex items-center gap-2 text-cem-neutral-gray-500 hover:text-cem-primary transition-colors mb-8 group"
              >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span className="font-medium">Volver a categorías</span>
              </button>

              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-2 leading-tight">
                  Resultados de búsqueda con
                </h1>
                <p className="text-4xl md:text-5xl font-bold text-cem-primary">
                  {search.toLowerCase()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content: Search Results OR Domains & Categories */}
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
              {domains.map((domain) => {
                const categoriesToShow = domain.categories || [];
                if (categoriesToShow.length === 0) return null;

                // Check if this domain is "Rutas de aprendizaje"
                const isLearningPath =
                  domain.name.toLowerCase().includes("ruta") ||
                  domain.name.toLowerCase().includes("programa");

                // Check if selected category belongs to this domain
                const showCoursesInThisDomain =
                  selectedCategory &&
                  categoriesToShow.some(
                    (cat) => cat.id === selectedCategory.id,
                  );

                return (
                  <div key={domain.id} className="mb-12">
                    <h2 className="text-xl font-bold text-cem-neutral-gray-800 mb-6 text-center">
                      {domain.name}
                    </h2>

                    {isLearningPath ? (
                      // Use LearningPathCard for learning paths
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
                        {categoriesToShow.map((category) => (
                          <LearningPathCard
                            key={`learning-path-${category.id}`}
                            category={category}
                            icon={getCategoryIcon(category.name)}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Category Cards */}
                        <div className="flex flex-wrap justify-center gap-4">
                          {categoriesToShow.map((category) => (
                            <CategoryCard
                              key={category.id}
                              category={category}
                              icon={getCategoryIcon(category.name)}
                              onClick={() => handleCategoryClick(category)}
                              isActive={selectedCategory?.id === category.id}
                              variant={
                                domain.name.toLowerCase().includes("programa")
                                  ? "primary"
                                  : "default"
                              }
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
                              className="overflow-hidden mt-8"
                            >
                              <div className="mb-6">
                                <h3 className="text-2xl font-bold text-cem-neutral-gray-900 mb-6 text-center">
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
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <ExperienceSection />
        <ScrollToTop />
      </div>
      <Footer />
    </div>
  );
};

export default CategorySelectionPage;
