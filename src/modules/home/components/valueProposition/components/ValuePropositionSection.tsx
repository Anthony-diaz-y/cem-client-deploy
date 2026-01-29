"use client";

import React from "react";
import Image from "next/image";
import { ValuePropositionCard } from "./ValuePropositionCard";
import { VALUE_PROPOSITION_CARDS } from "../../../constants/valueProposition.constants";
import guacamaya from "@shared/assets/values/guacamaya.webp";

export const ValuePropositionSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#0B4653] text-[20px] font-bold inline-block mb-4">
            Somos CEM
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4 max-w-sm md:max-w-none mx-auto">
            Nuestra propuesta de valor
          </h2>
        </div>

        {/* Grid de Cards - Layout: 3 arriba, 2 abajo, todas con la misma altura */}
        <div className="relative flex justify-center">
          <div className="max-w-sm md:max-w-none mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr lg:max-w-[calc(100%-160px)] mx-auto">
              {/* Primera fila - 3 cards */}
              <div className="md:col-span-1 lg:col-span-1">
                <ValuePropositionCard card={VALUE_PROPOSITION_CARDS[0]} />
              </div>
              <div className="md:col-span-1 lg:col-span-1">
                <ValuePropositionCard card={VALUE_PROPOSITION_CARDS[1]} />
              </div>
              <div className="md:col-span-1 lg:col-span-1">
                <ValuePropositionCard card={VALUE_PROPOSITION_CARDS[2]} />
              </div>

              {/* Segunda fila - 2 cards alineadas a la izquierda */}
              <div className="md:col-span-1 lg:col-span-1 relative">
                <ValuePropositionCard card={VALUE_PROPOSITION_CARDS[3]} />
              </div>
              <div className="md:col-span-1 lg:col-span-1">
                <ValuePropositionCard card={VALUE_PROPOSITION_CARDS[4]} />
              </div>

              {/* Guacamayo - Tablet: Como parte del grid (posición 6) */}
              <div className="hidden md:flex lg:hidden items-center justify-center">
                <div className="relative w-56 h-56">
                  <Image
                    src={guacamaya}
                    alt="Guacamayo CEM"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guacamayo - Desktop: Posicionado a la derecha */}
          <div
            className="absolute right-28 hidden lg:block z-10"
            style={{ top: "calc(50% + 2.5rem)" }}
          >
            <div className="relative w-56 h-56 xl:w-64 xl:h-64">
              <Image
                src={guacamaya}
                alt="Guacamayo CEM"
                fill
                className="object-contain drop-shadow-lg"
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* Guacamayo - Mobile: Centrado al final */}
        <div className="flex justify-center mt-8 md:hidden">
          <div className="relative w-72 h-72">
            <Image
              src={guacamaya}
              alt="Guacamayo CEM"
              fill
              className="object-contain drop-shadow-lg"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

