"use client";

import React from "react";
import Image from "next/image";
import { ALLIES_LOGOS } from "../../../constants/allies.constants";

export const AlliesSection: React.FC = () => {
  return (
    <section
      className="w-full py-16 md:py-20"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900">
            Nuestros aliados
          </h2>
        </div>

        {/* DESKTOP: Grid de Logos Estático */}
        <div className="hidden lg:grid grid-cols-5 gap-12 items-center justify-items-center">
          {ALLIES_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="relative w-full max-w-[180px] h-32 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="180px"
              />
            </div>
          ))}
        </div>

        {/* MOBILE/TABLET: 3 Filas de Infinite Scroll */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* Fila 1 - Normal */}
          <div className="relative w-full overflow-hidden mask-linear-gradient h-20 flex items-center">
            <div className="flex items-center animate-infinite-scroll-triple">
              {[...Array(3)].map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex items-center flex-shrink-0"
                >
                  {ALLIES_LOGOS.slice(0, 5).map((logo) => (
                    <div
                      key={`${groupIndex}-${logo.id}`}
                      className="w-[160px] flex-shrink-0 px-4"
                    >
                      <div className="relative h-16 w-full">
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Fila 2 - Reversa */}
          <div className="relative w-full overflow-hidden mask-linear-gradient h-20 flex items-center">
            <div
              className="flex items-center animate-infinite-scroll-triple"
              style={{ animationDirection: "reverse" }}
            >
              {[...Array(3)].map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex items-center flex-shrink-0"
                >
                  {[...ALLIES_LOGOS]
                    .reverse()
                    .slice(0, 5)
                    .map((logo) => (
                      <div
                        key={`${groupIndex}-${logo.id}`}
                        className="w-[160px] flex-shrink-0 px-4"
                      >
                        <div className="relative h-16 w-full">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Fila 3 - Normal */}
          <div className="relative w-full overflow-hidden mask-linear-gradient h-20 flex items-center">
            <div className="flex items-center animate-infinite-scroll-triple">
              {[...Array(3)].map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex items-center flex-shrink-0"
                >
                  {/* Rotación determinista para variar sin random */}
                  {[...ALLIES_LOGOS.slice(1), ...ALLIES_LOGOS.slice(0, 1)]
                    .slice(0, 5)
                    .map((logo) => (
                      <div
                        key={`${groupIndex}-${logo.id}`}
                        className="w-[160px] flex-shrink-0 px-4"
                      >
                        <div className="relative h-16 w-full">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

