"use client";

import React from "react";

/**
 * Header compartido para la sección de cursos
 */
export const CoursesSectionHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <span className="text-[#0B4653] text-[20px] font-bold inline-block mb-4">
        Explora
      </span>
      <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4">
        Nuestros cursos y programas
      </h2>
      <p className="text-lg text-cem-neutral-gray-600 max-w-sm md:max-w-2xl mx-auto">
        Cursos y programas para impulsar tu carrera en ciencias, con videos y
        recursos flexibles.
      </p>
    </div>
  );
};
