"use client";

import React, { useEffect, useState } from "react";
import { Domain } from "../types";
import { getAllDomains } from "../services/domainsAPI";
import { useCoursesData } from "../../courses/hooks/useCoursesData";
import { CoursesListSection } from "../../courses/components/coursesList";
import CategoryCard from "./CategoryCard";
import { BiSearch, BiArrowBack, BiX } from "react-icons/bi";
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

/** Página principal de cursos: maneja selección de categorías y listado de cursos */
const CategorySelectionPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  // Estado local para el input, no filtra inmediatamente
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [loadingDomains, setLoadingDomains] = useState(true);

  const {
    courses,
    category: selectedCategoryName,
    search: activeSearchTerm,
    loading: loadingCourses,
    isFetching,
    page,
    limit,
    meta,
    setCategory,
    setSearch,
    setPage,
  } = useCoursesData();

  // Sincronizar input local con URL si cambia externamente
  useEffect(() => {
    setLocalSearchTerm(activeSearchTerm || "");
  }, [activeSearchTerm]);

  // Carga inicial de todos los dominios y categorías disponibles
  useEffect(() => {
    const fetchDomains = async () => {
      setLoadingDomains(true);
      const data = await getAllDomains();
      console.log("DEBUG: Domains received from API:", data);
      setDomains(data);
      setLoadingDomains(false);
    };

    fetchDomains();
  }, []);

  // Selecciona una categoría, actualiza la URL y desplaza la vista al inicio
  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ejecuta la búsqueda de cursos al enviar el formulario
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      setSearch(localSearchTerm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Limpia la selección de categoría y el buscador para volver a la vista principal
  const clearSelection = () => {
    setCategory("");
    setLocalSearchTerm("");
  };

  const showCoursesList = !!selectedCategoryName || !!activeSearchTerm;

  if (loadingDomains) {
    return (
      <div className="min-h-screen bg-cem-neutral-white relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
              Nuestros cursos para crecer en{" "}
              <span className="text-cem-primary relative">ciencia</span>
            </h1>
            <div className="max-w-xl mx-auto relative h-12 bg-cem-neutral-gray-100 rounded-full animate-pulse"></div>
          </div>
          <CategorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cem-neutral-white relative overflow-hidden">
      {/* Decoración de fondo: Círculos Concéntricos Originales */}
      <ConcentricCircles
        size={500}
        circles={3}
        borderColor={brandColors.primary.light}
        dotColor={brandColors.primary.DEFAULT}
        showDot={true}
        className="absolute right-0 top-0 hidden md:block opacity-60 pointer-events-none translate-x-[20%]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header - Siempre visible */}
        <div className="text-center mb-12">
          {/* Botón Volver (Visible cuando hay filtros activos) */}
          <div className="h-8 mb-4 flex justify-center items-center relative">
            <AnimatePresence>
              {showCoursesList && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={clearSelection}
                  className="absolute left-0 lg:left-8 flex items-center gap-2 text-cem-neutral-gray-500 hover:text-cem-primary transition-colors text-sm font-medium"
                >
                  <BiArrowBack className="text-lg" />
                  Volver a categorías
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {activeSearchTerm ? (
            <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
              Resultados de búsqueda con <br className="hidden md:block" />
              <span className="text-cem-primary relative block mt-2">
                {activeSearchTerm}
              </span>
            </h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
              Nuestros cursos para crecer en{" "}
              <span className="text-cem-primary relative">ciencia</span>
            </h1>
          )}

          {/* Barra de Búsqueda - Ahora es un FORM para ejecutar búsqueda explícita */}
          <AnimatePresence>
            {!showCoursesList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-xl mx-auto relative"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center w-full shadow-sm rounded-full overflow-hidden border border-cem-neutral-gray-300 bg-white"
                >
                  <div className="pl-4 text-cem-neutral-gray-400">
                    <BiSearch className="text-xl" />
                  </div>
                  <input
                    type="text"
                    placeholder="¿Qué quieres aprender hoy?"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 focus:outline-none text-cem-neutral-gray-700 bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-cem-neutral-gray-100 hover:bg-cem-primary hover:text-white text-cem-neutral-gray-600 font-medium transition-colors border-l border-cem-neutral-gray-200"
                  >
                    Buscar
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Área de Contenido Dinámico */}
        <AnimatePresence mode="wait">
          {!showCoursesList ? (
            /* Vista 1: Grid de Categorías (Sin filtrar por búsqueda local) */
            <motion.div
              key="categories-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {domains.map((domain) => {
                // Ya no filtramos por search en tiempo real
                const categoriesToShow = domain.categories || [];
                if (categoriesToShow.length === 0) return null;

                return (
                  <div key={domain.id} className="mb-12">
                    <h2 className="text-xl font-bold text-cem-neutral-gray-800 mb-6 text-center">
                      {domain.name}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                      {categoriesToShow.map((category) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          icon={getCategoryIcon(category.name)}
                          onClick={() => handleCategorySelect(category.name)}
                          variant={
                            domain.name.toLowerCase().includes("programa")
                              ? "primary"
                              : "default"
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* Vista 2: Lista de Cursos (Resultados) */
            <motion.div
              key="courses-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {/* Indicador de Selección/Búsqueda (Solo si es categoría, si es búsqueda ya está en el header) */}
              {selectedCategoryName && (
                <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-10 text-center">
                  <h2 className="text-2xl font-bold text-cem-neutral-gray-900 flex items-center gap-2">
                    <>
                      Cursos de{" "}
                      <span className="text-cem-primary">
                        {selectedCategoryName}
                      </span>
                    </>
                  </h2>
                  <button
                    onClick={clearSelection}
                    className="p-1 rounded-full hover:bg-cem-neutral-gray-100 text-cem-neutral-gray-400 hover:text-red-500 transition-colors"
                    title="Borrar filtros"
                  >
                    <BiX className="text-2xl" />
                  </button>
                </div>
              )}

              <CoursesListSection
                courses={courses}
                selectedCategory={selectedCategoryName || activeSearchTerm}
                page={page}
                limit={limit}
                meta={meta}
                onPageChange={setPage}
                loading={loadingCourses || isFetching}
                hideHeader={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategorySelectionPage;
