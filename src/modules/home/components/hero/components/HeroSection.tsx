"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConcentricCircles } from "../../shared";
import { brandColors } from "@shared/design-tokens";
import doctor from "@shared/assets/hero/doctor.webp";
import iconCourse from "@shared/assets/hero/icon-course.webp";
import iconCoursesView from "@shared/assets/hero/icon-coursesView.webp";
import iconStudent from "@shared/assets/hero/icon-student.webp";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full bg-white pt-8 md:pt-16 lg:pt-8 overflow-hidden">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-8 items-stretch xl:items-center max-w-[1200px] mx-auto">
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
          <div className="relative w-full">
            {/* Círculo concéntrico decorativo mobile (250px) - Posicionado relativo a la columna */}
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

const HeroImageSection: React.FC = () => {
  return (
    <div className="relative h-[350px] md:h-[450px] lg:h-[600px] w-full max-w-[600px] mx-auto">
      {/* Círculo concéntrico decorativo desktop (400px) */}
      <ConcentricCircles
        size={400}
        circles={4}
        borderColor={brandColors.primary.light}
        className="absolute hidden md:block md:top-56 md:-right-48 lg:top-72 lg:-right-32 z-0"
      />
      <div
        className="relative w-[260px] h-[260px] min-[380px]:w-[300px] min-[380px]:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto"
        style={{ marginTop: "30px" }}
      >
        {/* Corona circular de fondo */}
        <div
          className="absolute z-0 w-[260px] h-[260px] min-[380px]:w-[300px] min-[380px]:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
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
          className="relative z-10 rounded-full overflow-hidden shadow-2xl w-[260px] h-[260px] min-[380px]:w-[300px] min-[380px]:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
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
        <HeroBadge
          position="top-left"
          value="3+"
          label="Cursos"
          imageSrc={iconCourse}
        />
        <HeroBadge
          position="top-right"
          value="5K+"
          label="Vistas de cursos"
          imageSrc={iconCoursesView}
        />
        <HeroBadge
          position="bottom-right"
          value="71+"
          label="Estudiantes"
          imageSrc={iconStudent}
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
  imageSrc: any;
}

const HeroBadge: React.FC<HeroBadgeProps> = ({
  position,
  value,
  label,
  imageSrc,
}) => {
  const positionClasses = {
    "top-left":
      "top-24 -left-8 min-[380px]:top-28 min-[380px]:-left-6 sm:-left-16 md:top-32 md:-left-24 lg:top-52 lg:-left-12",
    "top-right":
      "-top-2 -right-4 min-[380px]:-top-2 min-[380px]:-right-6 sm:-right-12 md:-top-8 md:-right-8 lg:-top-4 lg:-right-4",
    "bottom-right":
      "bottom-4 -right-4 min-[380px]:bottom-8 min-[380px]:-right-6 sm:-right-12 md:bottom-12 md:-right-16 lg:bottom-16 lg:-right-4",
  };

  const isVertical = position === "top-right";

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-white rounded-xl md:rounded-2xl p-2 min-[380px]:p-3 md:p-4 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border border-gray-100 z-20 transition-transform duration-300 hover:scale-105 ${isVertical ? "min-w-[90px] min-[380px]:min-w-[100px] md:min-w-[120px]" : "flex items-center gap-2 min-[380px]:gap-3 md:gap-4 pr-4 min-[380px]:pr-6 md:pr-8"}`}
    >
      <div
        className={`relative flex-shrink-0 ${isVertical ? "w-10 h-10 min-[380px]:w-12 min-[380px]:h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3" : "w-8 h-8 min-[380px]:w-10 min-[380px]:h-10 md:w-14 md:h-14"}`}
      >
        <Image src={imageSrc} alt="icon" fill className="object-contain" />
      </div>

      <div className={`${isVertical ? "text-center" : ""}`}>
        {position === "top-right" && (
          <>
            <p className="text-xl md:text-3xl font-bold text-gray-900 leading-none">
              {value}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 whitespace-nowrap">
              {label}
            </p>
          </>
        )}

        {position === "top-left" && (
          <>
            <p className="text-xl md:text-3xl font-bold text-gray-900 leading-none">
              {value}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              {label}
            </p>
          </>
        )}

        {position === "bottom-right" && (
          <div className="flex flex-col">
            <p className="text-xs md:text-sm text-gray-500 leading-tight mb-0.5 md:mb-1">
              {label}
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {value}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
