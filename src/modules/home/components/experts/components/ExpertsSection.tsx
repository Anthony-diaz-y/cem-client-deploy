"use client";

import React from "react";
import { ExpertCard } from "./ExpertCard";
import { EXPERTS } from "../../../constants/experts.constants";

export const ExpertsSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[#0B4653] text-[20px] font-bold inline-block mb-4">
              Expertos
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4 max-w-sm md:max-w-none mx-auto">
              Conoce a nuestros expertos
            </h2>
            <p className="text-lg text-cem-neutral-gray-600 max-w-2xl mx-auto">
              Expertos líderes en ciencias que guían tu carrera.
            </p>
          </div>

          {/* Grid de Expertos */}
          <div className="max-w-sm md:max-w-none mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {EXPERTS.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

