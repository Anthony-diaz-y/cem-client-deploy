"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

interface CategorySelectionHeaderProps {
  search: string;
  localSearchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onBackToCategories: () => void;
}

export function CategorySelectionHeader({
  search,
  localSearchQuery,
  onSearchChange,
  onSearchSubmit,
  onBackToCategories,
}: CategorySelectionHeaderProps) {
  if (!search) {
    return (
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cem-neutral-gray-900 mb-8">
          Nuestros cursos para crecer en{" "}
          <span className="text-cem-primary relative">ciencia</span>
        </h1>
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={onSearchSubmit}
            className="relative flex items-center w-full bg-white border border-cem-neutral-gray-200 rounded-full shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-cem-primary/10 focus-within:border-cem-primary transition-all"
          >
            <div className="pl-6 text-cem-neutral-gray-400 group-focus-within:text-cem-primary transition-colors">
              <FiSearch size={22} />
            </div>
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
      </div>
    );
  }

  return (
    <div className="mb-12">
      <button
        onClick={onBackToCategories}
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
    </div>
  );
}
