"use client";

import React from "react";
import type { ValuePropositionCard as ValuePropositionCardType } from "../../../constants/valueProposition.constants";
import { ValuePropositionIcons } from "./ValuePropositionIcons";

interface ValuePropositionCardProps {
  card: ValuePropositionCardType;
}

export const ValuePropositionCard: React.FC<ValuePropositionCardProps> = ({
  card,
}) => {
  // Obtener el icono basado en el nombre
  const IconComponent = ValuePropositionIcons[card.iconName];

  return (
    <div className="group relative rounded-xl p-6 md:p-8 bg-white text-cem-neutral-gray-900 border border-cem-neutral-gray-200 transition-all duration-500 hover:bg-cem-primary hover:text-white hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
      <div className="flex flex-col h-full gap-4">
        <div>
          {/* Icono - Cambia a blanco/opaco en hover */}
          <div className="flex items-center max-w-72 gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center bg-cem-teal-50 text-cem-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-500">
              <IconComponent /> 
            </div>
            <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-cem-neutral-gray-900 group-hover:text-white transition-colors duration-500">
              {card.title}
            </h3>
          </div>

        </div>
        {/* Contenido */}
        <div className="flex-1 flex flex-col gap-3">

          <p className="text-sm md:text-[16px] max-w-[270px] leading-relaxed text-cem-neutral-gray-600 group-hover:text-white/90 transition-colors duration-500">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};

