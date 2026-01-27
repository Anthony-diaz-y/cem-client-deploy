"use client";
import React from "react";
import type { ValuePropositionCard as ValuePropositionCardType } from "../../constants/valueProposition.constants";
import { ValuePropositionIcons } from "./ValuePropositionIcons";

interface ValuePropositionCardProps {
  card: ValuePropositionCardType;
}

export const ValuePropositionCard: React.FC<ValuePropositionCardProps> = ({
  card,
}) => {
  const isLarge = card.isLarge;
  const isTeal = card.bgColor === "teal";
  
  // Obtener el icono basado en el nombre
  const IconComponent = ValuePropositionIcons[card.iconName];

  return (
    <div
      className={`
        rounded-xl p-6 md:p-8
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        h-full
        ${
          isTeal
            ? "bg-cem-primary text-white"
            : "bg-white text-cem-neutral-gray-900 border border-cem-neutral-gray-200"
        }
      `}
    >
      <div
        className="flex flex-col h-full gap-4"
      >
        {/* Icono */}
        <div
          className={`
            w-12 h-12 md:w-14 md:h-14
            rounded-lg
            flex items-center justify-center
            ${
              isTeal
                ? "bg-white/20 text-white"
                : "bg-cem-teal-50 text-cem-primary"
            }
            mb-4
          `}
        >
          <IconComponent />
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col gap-3">
          <h3
            className={`
              font-bold text-lg md:text-xl lg:text-2xl
              ${isTeal ? "text-white" : "text-cem-neutral-gray-900"}
            `}
          >
            {card.title}
          </h3>
          <p
            className={`
              text-sm md:text-base
              leading-relaxed
              ${
                isTeal
                  ? "text-white/90"
                  : "text-cem-neutral-gray-600"
              }
            `}
          >
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};

