"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiMicroscope,
  GiWheat,
  GiHealthNormal,
  GiChemicalDrop,
} from "react-icons/gi";
import type { Domain, Category } from "../types";
import CategoryCard from "./CategoryCard";
import LearningPathCard from "./LearningPathCard";
import { HomeCourseCard } from "@/modules/home/components/courses/components/HomeCourseCard";

export function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  if (name.includes("biología") || name.includes("biotecnología"))
    return <GiMicroscope />;
  if (name.includes("agropecuaria") || name.includes("veterinaria"))
    return <GiWheat />;
  if (name.includes("salud")) return <GiHealthNormal />;
  if (name.includes("alimento")) return <GiChemicalDrop />;
  return <GiMicroscope />;
}

interface DomainsSectionProps {
  domains: Domain[];
  selectedCategory: Category | null;
  onCategoryClick: (category: Category) => void;
}

export function DomainsSection({
  domains,
  selectedCategory,
  onCategoryClick,
}: DomainsSectionProps) {
  return (
    <motion.div
      key="domain-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {domains.map((domain) => {
        const categoriesToShow = domain.categories || [];
        if (categoriesToShow.length === 0) return null;

        const isLearningPath =
          domain.name.toLowerCase().includes("ruta") ||
          domain.name.toLowerCase().includes("programa");

        const showCoursesInThisDomain =
          selectedCategory &&
          categoriesToShow.some((cat) => cat.id === selectedCategory.id);

        return (
          <div key={domain.id} className="mb-12">
            <h2 className="text-xl font-bold text-cem-neutral-gray-800 mb-6 text-center">
              {domain.name}
            </h2>

            {isLearningPath ? (
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
                <div className="flex flex-wrap justify-center gap-4">
                  {categoriesToShow.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      icon={getCategoryIcon(category.name)}
                      onClick={() => onCategoryClick(category)}
                      isActive={selectedCategory?.id === category.id}
                      variant={
                        domain.name.toLowerCase().includes("programa")
                          ? "primary"
                          : "default"
                      }
                    />
                  ))}
                </div>
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
                        {selectedCategory.courses && selectedCategory.courses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedCategory.courses.map((course, index) => (
                              <HomeCourseCard
                                key={course.id}
                                course={course}
                                index={index}
                                categoryName={selectedCategory.name}
                              />
                            ))}
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
  );
}
