"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import studentImage from "@shared/assets/register/student.webp";
import logoCEM from "@shared/assets/Logo/Logo-CEM.png";

const RegisterImagePanel: React.FC = () => {
  return (
    <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-screen shrink-0 grow-0">
      <div className="relative w-full h-full">
        <Image
          src={studentImage}
          alt="Estudiante CEM"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={100}
          className="object-cover object-top lg:object-center"
        />
        {/* Overlay sutil para móvil */}
        <div className="absolute inset-0 bg-black/5 lg:hidden"></div>
      </div>

      {/* Logo CEM en la esquina superior izquierda */}
      <div className="absolute z-30 top-6 left-6 lg:top-10 lg:left-10">
        <Link
          href="/"
          className="block transition-transform hover:scale-105 active:scale-95"
        >
          <div className="brightness-0 invert drop-shadow-md">
            <Image
              src={logoCEM}
              alt="CEM Logo"
              width={140}
              height={45}
              priority
              className="object-contain w-[110px] lg:w-[150px] h-auto"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RegisterImagePanel;

