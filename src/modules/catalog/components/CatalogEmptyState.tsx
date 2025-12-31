"use client";

import React from "react";

/**
 * CatalogEmptyState - Empty state component for catalog page
 */
const CatalogEmptyState: React.FC = () => {
  return (
    <div className="text-white text-center py-20 px-4">
      <div className="max-w-md mx-auto">
        <svg className="w-24 h-24 mx-auto mb-4 text-richblack-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-2xl font-semibold mb-2">No hay cursos disponibles</h2>
        <p className="text-richblack-300">
          No se encontraron cursos para esta categoría en este momento.
        </p>
      </div>
    </div>
  );
};

export default CatalogEmptyState;
