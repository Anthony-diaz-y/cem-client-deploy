"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConcentricCircles } from "../../shared";
import { brandColors } from "@shared/design-tokens";
import doctor from "@shared/assets/hero/doctor.webp";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full bg-white pt-8 md:pt-16 lg:pt-8 overflow-hidden">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-8 items-center max-w-[1200px] mx-auto">
          {/* Sección izquierda - Texto y botones */}
          <div className="relative space-y-4 md:space-y-6 z-10 text-center xl:text-left">
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
              className="hidden md:block -top-8 -left-20"
            />

            {/* Círculo concéntrico decorativo derecha - Solo Desktop */}
            <ConcentricCircles
              size={400}
              circles={4}
              borderColor={brandColors.primary.light}
              className="hidden lg:block top-52 -right-[520px] xl:-right-[700px]"
            />

            <h1 className="text-[38px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight relative z-10">
              <span className="text-cem-neutral-gray-900">Da el</span>{" "}
              <span className="text-cem-primary">siguiente</span>
              <br />
              <span className="text-cem-neutral-gray-900">paso en tu</span>{" "}
              <span className="text-cem-primary">carrera</span>
              <br />
              <span className="text-cem-neutral-gray-900">en</span>{" "}
              <span className="text-cem-primary">ciencias</span>
            </h1>

            <p className="text-sm sm:text-[16px] md:text-xl text-cem-neutral-gray-600 leading-relaxed max-w-2xl relative z-10 mx-auto xl:mx-0">
              Te ayudamos a impulsar tu carrera en ciencias, con miles de cursos
              en línea, contenidos en video y docentes especializados, diseñada
              para aprender de forma clara, flexible y a tu ritmo.
            </p>

            <div className="flex flex-row gap-4 pt-2 md:pt-4 relative z-10 justify-center xl:justify-start">
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
    <div className="relative h-[350px] md:h-[450px] lg:h-[600px] w-full max-w-[600px] mx-auto">
      <div
        className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto"
        style={{ marginTop: "30px" }}
      >
        {/* Corona circular de fondo */}
        <div
          className="absolute z-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
          style={{
            borderRadius: "50%",
            border: `1px solid ${brandColors.primary.DEFAULT}`,
            top: "-20px",
            left: "-20px",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        />

        {/* Círculo principal con imagen */}
        <div
          className="relative z-10 rounded-full overflow-hidden shadow-2xl w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
          style={{
            borderRadius: "50%",
            marginTop: "30px",
            marginLeft: "10px",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={doctor}
              alt="doctora"
              fill
              className="object-cover"
              style={{ borderRadius: "50%" }}
              priority
            />
          </div>
        </div>

        {/* Badges */}
        <HeroBadge position="top-left" value="3+" label="Cursos" icon="menu" />
        <HeroBadge
          position="top-right"
          value="5K+"
          label="cursos"
          icon="progress"
        />
        <HeroBadge
          position="bottom-right"
          value="71+"
          label="Estudiantes"
          icon="users"
        />

        {/* Punto decorativo */}
        <div className="hidden md:block absolute bottom-1 left-6 md:bottom-2 md:left-10 lg:left-12 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-cem-primary rounded-full z-20"></div>
      </div>
    </div>
  );
};

interface HeroBadgeProps {
  position: "top-left" | "top-right" | "bottom-right";
  value: string;
  label: string;
  icon: "menu" | "progress" | "users";
}

const HeroBadge: React.FC<HeroBadgeProps> = ({
  position,
  value,
  label,
  icon,
}) => {
  const positionClasses = {
    "top-left": "top-32 -left-2 md:top-44 md:-left-6 lg:top-52 lg:-left-8",
    "top-right": "top-2 -right-2 md:top-6 md:-right-3 lg:top-8 lg:-right-4",
    "bottom-right":
      "bottom-8 -right-2 md:bottom-12 md:-right-3 lg:bottom-16 lg:-right-4",
  };

  const iconBgColor = icon === "users" ? "bg-cem-primary" : "bg-cem-teal-100";

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-white rounded-lg p-2 md:p-3 lg:p-4 border border-1 border-cem-primary z-20 ${position === "top-right" ? "min-w-[100px] md:min-w-[120px]" : ""}`}
    >
      {icon === "progress" ? (
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0">
            <svg
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3"
                strokeDasharray="28 84"
                strokeDashoffset="10"
                transform="rotate(-90 18 18)"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-cem-primary leading-none">
              {value}
            </p>
            <p className="text-xs md:text-sm text-cem-primary mt-1">{label}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            {icon === "menu" && (
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
            {icon === "users" && (
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </div>
          <div>
            {position === "bottom-right" ? (
              <>
                <p className="text-xs md:text-sm text-cem-primary leading-tight">
                  {label}
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-cem-primary leading-none mt-0.5">
                  {value}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-cem-primary leading-none">
                  {value}
                </p>
                <p className="text-xs md:text-sm text-cem-primary mt-1">
                  {label}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

