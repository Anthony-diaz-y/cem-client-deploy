"use client";

import React from "react";
import Link from "next/link";
import { ConcentricCircles } from "../shared";
import { brandColors } from "@shared/design-tokens";
import { HeroContent } from "@modules/home/constants/hero.constants";
import { HeroImageSection } from "./components/HeroImageSection";

interface HeroSectionProps {
  hero: HeroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <div className="relative w-full pt-8 md:pt-16 lg:pt-8 xl:px-10 mb-14">
      <div className="relative w-full max-w-[1400px] mx-auto xl:px-4 md:px-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-8 h-200 items-stretch xl:justify-center xl:items-center max-w-[1200px] mx-auto">

          <div className="flex flex-col gap-6">
            {/* Círculo concéntrico principal - Mobile */}
            <ConcentricCircles
              size={250}
              circles={4}
              borderColor={brandColors.primary.light}
              className="block md:hidden -top-4 -left-12"
            />

            {/* Círculo concéntrico principal - Tablet/Desktop */}
            <ConcentricCircles
              size={400}
              circles={4}
              borderColor={brandColors.primary.light}
              className="hidden md:block top-11 -left-24 absolute"
            />

            <h1 className="text-[30px]  text-center xl:text-left md:text-5xl lg:text-6xl font-bold relative z-10 max-w-2xl mx-auto xl:mx-0 flex flex-col gap-1 xl:gap-3.5 leading-tight ">
              <span className="text-cem-neutral-gray-900">
                Da el <span className="text-cem-primary">siguiente</span>
              </span>
              <span className="-mt-1 md:mt-0 text-cem-neutral-gray-900">
                paso en tu <span className="text-cem-primary">carrera</span>
              </span>
              <span className="-mt-1 md:mt-0 text-cem-neutral-gray-900">
                en <span className="text-cem-primary">ciencias</span>
              </span>
            </h1>

            <p className="text-[12px] text-center   xl:text-left sm:text-[16px] md:text-xl text-cem-neutral-gray-600 leading-relaxed max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-xl z-10 mx-auto xl:mx-0">
              {hero.description}
            </p>

            <div className="flex flex-row gap-4 pt-2 md:pt-4 relative z-10 justify-center xl:justify-start">
              <Link href="/auth/login">
                <button className="px-6 py-3 bg-cem-primary border border-1 border-[#E8F8FD] text-white font-medium text-base rounded-lg shadow-md">
                  Acceder
                </button>
              </Link>
              <Link href="/courses">
                <button className="px-6 py-3 bg-[#BFDCE2] border border-1 border-[#9CCCD6] text-[#0B4653] font-medium text-base rounded-lg">
                  Conoce más
                </button>
              </Link>
            </div>
          </div>

          {/* Sección derecha - Imagen circular con badges */}
          <div className=" w-full flex justify-center items-center">
            <ConcentricCircles
              size={250}
              circles={4}
              borderColor={brandColors.primary.light}
              className="absolute bottom-0 -right-24 block md:hidden z-0"
            />
              <HeroImageSection />

          </div>
        </div>
      </div>
    </div>
  );
};
