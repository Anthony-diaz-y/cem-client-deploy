"use client";

import React from "react";

export const ErrorState: React.FC = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center py-12">
          <p className="text-cem-neutral-gray-600 text-lg">
            Error al cargar los cursos. Por favor, intenta nuevamente más tarde.
          </p>
        </div>
      </div>
    </div>
  );
};
