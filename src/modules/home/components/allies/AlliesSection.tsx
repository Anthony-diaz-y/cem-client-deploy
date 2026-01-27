"use client";
import React from "react";
import Image from "next/image";
import { ALLIES_LOGOS } from "../../constants/allies.constants";

export const AlliesSection: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-20" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-11/12 max-w-maxContent mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900">
            Nuestros aliados
          </h2>
        </div>

        {/* Grid de Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 items-center justify-items-center">
          {ALLIES_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="relative w-full max-w-[180px] h-20 md:h-28 lg:h-32 flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 120px, (max-width: 1024px) 150px, 180px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

