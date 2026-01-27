"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ConcentricCircles from "./ConcentricCircles";
import { brandColors } from "@shared/design-tokens";
import doctor from "@shared/assets/hero/doctor.webp";

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full bg-white py-16 md:py-8 overflow-visible !bg-white">
      <div className="relative w-11/12 max-w-maxContent mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sección izquierda - Texto y botones */}
          <div className="relative space-y-6 z-10">
            <ConcentricCircles
              size={400}
              circles={4}
              borderColor={brandColors.primary.light}
              dotColor={brandColors.primary.light}
              showDot={false}
              dotSize={16}
              className="-top-8 -left-20"
            />

            <ConcentricCircles
              size={400}
              circles={4}
              borderColor={brandColors.primary.light}
              dotColor={brandColors.primary.light}
              showDot={true}
              dotSize={16}
              dotClassName="bottom-24 right-80"
              className="top-52 -right-[700px]"
            />
            
            <div 
              className="absolute -top-[22px] left-0 z-0"
              style={{ 
                width: '8px', 
                height: '8px',
                borderRadius: '50%',
                backgroundColor: brandColors.primary.light,
                pointerEvents: 'none'
              }}
            />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight relative z-10">
              <span className="text-cem-neutral-gray-900">Da el</span>{" "}
              <span className="text-cem-primary">siguiente</span>
              <br />
              <span className="text-cem-neutral-gray-900">paso en tu</span>{" "}
              <span className="text-cem-primary">carrera</span>
              <br />
              <span className="text-cem-neutral-gray-900">en</span>{" "}
              <span className="text-cem-primary">ciencias</span>
            </h1>

            <p className="text-[16px] md:text-xl text-cem-neutral-gray-600 leading-relaxed max-w-2xl relative z-10">
              Te ayudamos a impulsar tu carrera en ciencias, con miles de cursos en línea, 
              contenidos en video y docentes especializados, diseñada para aprender de forma 
              clara, flexible y a tu ritmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 relative z-10">
              <Link href="/auth/login">
                <button className="px-6 py-3 bg-cem-primary border border-1 border-[#E8F8FD] text-white font-medium text-base rounded-lg shadow-md">
                  Acceder
                </button>
              </Link>
              <Link href="/about">
                <button className="px-6 py-3 bg-[#BFDCE2] border border-1 border-[#9CCCD6] text-[#0B4653] font-medium text-base rounded-lg">
                  Conoce más
                </button>
              </Link>
            </div>
          </div>

          {/* Sección derecha - Imagen circular con badges */}
          <HeroImageSection />
        </div>
      </div>
    </div>
  );
};

const HeroImageSection: React.FC = () => {
  return (
    <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center overflow-visible">
      {/* Corona circular de fondo */}
      <div 
        className="absolute z-0"
        style={{ 
          width: '500px', 
          height: '500px',
          borderRadius: '50%',
          border: `1px solid ${brandColors.primary.DEFAULT}`,
          top: '30px',
          left: '10px',
          minWidth: '500px',
          minHeight: '500px',
          maxWidth: '500px',
          maxHeight: '500px',
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }}
      />

      {/* Círculo principal con imagen */}
      <div 
        className="relative z-10 rounded-full overflow-hidden shadow-2xl"
        style={{ 
          width: '500px', 
          height: '500px',
          borderRadius: '50%'
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={doctor}
            alt="doctora"
            fill
            className="object-cover"
            style={{ borderRadius: '50%' }}
            priority
          />
        </div>
      </div>

      {/* Badges */}
      <HeroBadge position="top-left" value="3+" label="Cursos" icon="menu" />
      <HeroBadge position="top-right" value="5K+" label="cursos" icon="progress" />
      <HeroBadge position="bottom-right" value="71+" label="Estudiantes" icon="users" />

      {/* Punto decorativo */}
      <div className="absolute bottom-12 left-12 w-10 h-10 bg-cem-primary rounded-full z-20"></div>
    </div>
  );
};

interface HeroBadgeProps {
  position: 'top-left' | 'top-right' | 'bottom-right';
  value: string;
  label: string;
  icon: 'menu' | 'progress' | 'users';
}

const HeroBadge: React.FC<HeroBadgeProps> = ({ position, value, label, icon }) => {
  const positionClasses = {
    'top-left': 'top-52 -left-8 lg:-left-8',
    'top-right': 'top-8 right-0 lg:right-4',
    'bottom-right': 'bottom-16 right-0 lg:right-4',
  };

  const iconBgColor = icon === 'users' ? 'bg-cem-primary' : 'bg-cem-teal-100';

  return (
    <div className={`absolute ${positionClasses[position]} bg-white rounded-lg p-4 border border-1 border-cem-primary z-20 ${position === 'top-right' ? 'min-w-[120px]' : ''}`}>
      {icon === 'progress' ? (
        <div className="flex flex-col items-center gap-2.5">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="2.5"/>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="28 84" strokeDashoffset="10" transform="rotate(-90 18 18)" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cem-primary leading-none">{value}</p>
            <p className="text-sm text-cem-primary mt-1">{label}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {icon === 'menu' && (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
            {icon === 'users' && (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <div>
            {position === 'bottom-right' ? (
              <>
                <p className="text-sm text-cem-primary leading-tight">{label}</p>
                <p className="text-2xl font-bold text-cem-primary leading-none mt-0.5">{value}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-cem-primary leading-none">{value}</p>
                <p className="text-sm text-cem-primary mt-1">{label}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;

