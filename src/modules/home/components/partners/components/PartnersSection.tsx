"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import { brandColors } from "@shared/design-tokens";
import { FloatingWhatsApp } from "@shared/components";
import fifteenFifteen from "@shared/assets/allies/1551.webp";
import proInnovate from "@shared/assets/allies/proInnovate.webp";
import starUp from "@shared/assets/allies/starUp.webp";

export const PartnersSection: React.FC = () => {
  return (
    <div className="border-cem-neutral-gray-200 relative ">
      <div className="max-w-[1200px] mx-auto">
        {/* Línea horizontal decorativa */}
        <div className="relative mb-6 z-30 w-full" style={{ height: "6px" }}>
          <svg
            width="100%"
            height="6"
            viewBox="0 0 1200 6"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={brandColors.primary.DEFAULT}
                  stopOpacity="0.4"
                />
                <stop
                  offset="50%"
                  stopColor={brandColors.primary.DEFAULT}
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor={brandColors.primary.DEFAULT}
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <polygon
              points="0,2.9 1200,2 1200,4 0,3.1"
              fill="url(#lineGradient)"
            />
          </svg>
        </div>

        {/* Logos Container */}
        <div className="w-full">
          {/* DESKTOP: Layout Estático Original (Visible solo en pantallas grandes) */}
          <div className="hidden lg:flex items-center justify-between w-full gap-5">
            <div className="flex flex-col items-start gap-0 flex-shrink-0">
              <span className="text-cem-neutral-gray-800 font-semibold text-[25px]">
                Con el
              </span>
              <span className="text-cem-primary font-semibold text-[25px]">
                respaldo
              </span>
            </div>

            <PartnerLogo src={fifteenFifteen} alt="1551 Logo" />
            <PartnerLogo src={proInnovate} alt="PRO Innovate Logo" />
            <PartnerLogo src={starUp} alt="STARTUP PERÚ Logo" />
          </div>

          {/* MOBILE/TABLET: Layout en una sola fila (Título + Slider) */}
          <div className="lg:hidden relative flex flex-row items-center w-full overflow-hidden">
            {/* Título Estático a la izquierda - Estilo de la imagen */}
            <div className="flex flex-col items-start justify-center pr-4 z-20 bg-white shadow-[10px_0_20px_white]">
              <span className="text-cem-neutral-gray-800 font-medium text-[16px] leading-tight">
                Con el
              </span>
              <span className="text-cem-primary font-bold text-[20px] leading-tight -mt-0.5">
                respaldo
              </span>
            </div>

            {/* Slider container - Ocupa el resto del espacio */}
            <div className="relative flex-1 overflow-hidden mask-linear-gradient h-16 flex items-center">
              {/* Máscaras de desvanecimiento suave - Reducido para no cortar logos */}
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10"></div>

              {/* Pista de animación - Triple grupo para scroll infinito perfecto */}
              <div className="flex items-center animate-infinite-scroll-triple">
                {/* Grupo 1: Ítems Originales */}
                <div className="flex items-center flex-shrink-0">
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={fifteenFifteen}
                      alt="1551 Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={proInnovate}
                      alt="PRO Innovate Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={starUp}
                      alt="STARTUP PERÚ Logo"
                      priority
                    />
                  </div>
                </div>

                {/* Grupo 2: Primera Copia */}
                <div className="flex items-center flex-shrink-0">
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={fifteenFifteen}
                      alt="1551 Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={proInnovate}
                      alt="PRO Innovate Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={starUp}
                      alt="STARTUP PERÚ Logo"
                      priority
                    />
                  </div>
                </div>

                {/* Grupo 3: Segunda Copia (Para Loop Perfecto) */}
                <div className="flex items-center flex-shrink-0">
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={fifteenFifteen}
                      alt="1551 Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={proInnovate}
                      alt="PRO Innovate Logo"
                      priority
                    />
                  </div>
                  <div className="w-[180px] flex-shrink-0 flex justify-center px-12 lg:px-8">
                    <PartnerLogo
                      src={starUp}
                      alt="STARTUP PERÚ Logo"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
    </div>
  );
};

interface PartnerLogoProps {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({
  src,
  alt,
  priority = false,
}) => {
  return (
    <div className="relative z-10 flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        width={160}
        height={100}
        className="object-contain h-20 lg:h-28"
        priority={priority}
      />
    </div>
  );
};
