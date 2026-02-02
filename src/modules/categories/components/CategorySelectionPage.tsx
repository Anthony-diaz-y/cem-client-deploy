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

  if (loadingDomains) {
    return (
      <div className="min-h-screen bg-cem-neutral-white relative overflow-hidden">
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
    <div className="min-h-screen bg-cem-neutral-white relative overflow-hidden">
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
            Nuestros cursos para crecer en{" "}
            <span className="text-cem-primary relative">ciencia</span>
          </h1>
        </div>

        {/* Domains and Categories */}
        <div>
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
              categoriesToShow.some((cat) => cat.id === selectedCategory.id);

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
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionPage;
