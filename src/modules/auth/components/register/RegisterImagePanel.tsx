"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import studentImage from "@shared/assets/register/student.webp";
import logoCEM from "@shared/assets/Logo/Logo-CEM.png";

const RegisterImagePanel: React.FC = () => {
  return (
    <div className="relative hidden lg:block w-1/2 h-screen shrink-0 grow-0">
      <div className="relative w-full h-full">
        <Image
          src={studentImage}
          alt="Estudiante CEM"
          fill
          priority
          sizes="50vw"
          quality={95}
          className="object-cover object-center"
        />
      </div>
      {/* Logo CEM en la esquina superior izquierda */}
      <div className="absolute z-10 top-8 left-8">
        <Link href="/" className="block">
          <div className="brightness-0 invert">
            <Image
              src={logoCEM}
              alt="CEM Logo"
              width={120}
              height={40}
              priority
              className="object-contain w-[7.5rem] h-auto"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RegisterImagePanel;

