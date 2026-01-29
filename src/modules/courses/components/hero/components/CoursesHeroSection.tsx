"use client";

import React, { useEffect, useState } from "react";
import { ConcentricCircles } from "@modules/home/components/shared";
import { brandColors } from "@shared/design-tokens";

interface CoursesHeroSectionProps {
  initialValue?: string;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
}

export const CoursesHeroSection: React.FC<CoursesHeroSectionProps> = ({
  initialValue = "",
  onSearch,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Sync with URL changes
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== initialValue) {
        onSearch?.(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, initialValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="relative w-full bg-white py-12 md:py-16">
      <div className="relative w-full max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Círculos decorativos con animación - posicionados para no cortarse */}
        <ConcentricCircles
          size={400}
          circles={3}
          borderColor={brandColors.primary.light}
          dotColor={brandColors.primary.DEFAULT}
          showDot={true}
          dotSize={8}
          className="absolute -right-32 top-0 hidden lg:block"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Título principal */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Nuestros cursos para
            <br className="hidden sm:block" /> crecer en{" "}
            <span className="text-cem-primary">ciencia</span>
          </h1>

          {/* Barra de búsqueda estilo pill */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <div className="pl-6 pr-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-cem-primary rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué quieres aprender?"
                className="flex-1 py-3 px-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-cem-primary text-white px-8 py-3 rounded-full font-medium hover:bg-cem-primary-dark transition-colors m-1"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
