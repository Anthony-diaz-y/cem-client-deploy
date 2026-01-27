"use client";
import React from "react";
import Image, { type StaticImageData } from "next/image";
import { brandColors } from "@shared/design-tokens";
import { FaWhatsapp } from "react-icons/fa";
import fifteenFifteen from "@shared/assets/allies/1551.webp";
import CBP from "@shared/assets/allies/CBP.webp";
import proInnovate from "@shared/assets/allies/proInnovate.webp";
import starUp from "@shared/assets/allies/starUp.webp";
import guacamayo from "@shared/assets/hero/guacamayo.webp";

const PartnersSection: React.FC = () => {
  return (
    <div className="border-cem-neutral-gray-200 relative pb-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Línea horizontal decorativa */}
        <div className="relative mb-6 z-30 w-full" style={{ height: '6px' }}>
          <svg width="100%" height="6" viewBox="0 0 1200 6" preserveAspectRatio="none" className="absolute top-0 left-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={brandColors.primary.DEFAULT} stopOpacity="0.4" />
                <stop offset="50%" stopColor={brandColors.primary.DEFAULT} stopOpacity="0.7" />
                <stop offset="100%" stopColor={brandColors.primary.DEFAULT} stopOpacity="1" />
              </linearGradient>
            </defs>
            <polygon
              points="0,2.9 1200,2 1200,4 0,3.1"
              fill="url(#lineGradient)"
            />
          </svg>
        </div>
        
        {/* Logos */}
        <div className="relative flex items-center justify-between w-full gap-4 lg:gap-5 flex-wrap">
        <div className="flex flex-col items-start gap-0 flex-shrink-0">
          <span className="text-cem-neutral-gray-800 font-semibold text-[25px] lg:text-[25px]">
            Con el
          </span>
          <span className="text-cem-primary font-semibold text-[25px] lg:text-[25px]">
            respaldo
          </span>
        </div>
        
        <PartnerLogo src={fifteenFifteen} alt="1551 Logo" />
        <PartnerLogo src={CBP} alt="CBP Logo" />
        <PartnerLogo src={proInnovate} alt="PRO Innovate Logo" />
        <PartnerLogo src={starUp} alt="STARTUP PERÚ Logo" />
        </div>
      </div>
      
      {/* WhatsApp y Guacamayo - Posicionados sticky a la derecha */}
      <div className="fixed right-0 bottom-20 lg:bottom-24 z-20 flex flex-col items-center">
        {/* Burbuja de diálogo con WhatsApp - Justo encima del guacamayo */}
        <div className="relative mb-2">
          {/* Burbuja de diálogo */}
          <a
            href="https://wa.me/51983885114"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-105"
            style={{ 
              width: '45px',
              height: '45px',
              padding: '8px'
            }}
            aria-label="Contactar por WhatsApp"
          >
            <FaWhatsapp className="text-[#25D366]" size={22} />
          </a>
          
          {/* Puntero de la burbuja apuntando hacia abajo */}
          <div 
            className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '10px solid white',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
            }}
          />
          
          {/* Línea conectora desde la burbuja al guacamayo */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: '2px',
              height: '12px',
              backgroundColor: '#C4EBDF',
              marginTop: '8px',
              borderRadius: '1px',
            }}
          />
        </div>
        
        {/* Guacamayo decorativo */}
        <div className="relative w-16 h-16 lg:w-20 lg:h-20">
          <Image
            src={guacamayo}
            alt="Guacamayo CEM"
            fill
            className="object-contain drop-shadow-lg"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
};

interface PartnerLogoProps {
  src: string | StaticImageData;
  alt: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => {
  return (
    <div className="relative z-10 flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        width={160}
        height={100}
        className="object-contain h-20 lg:h-28"
      />
    </div>
  );
};

export default PartnersSection;

