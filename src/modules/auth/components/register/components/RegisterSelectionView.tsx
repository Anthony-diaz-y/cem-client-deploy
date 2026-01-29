"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

interface RegisterSelectionViewProps {
  onEmailClick: () => void;
  onGoogleClick: () => void;
}

const RegisterSelectionView: React.FC<RegisterSelectionViewProps> = ({
  onEmailClick,
  onGoogleClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center px-2">
      {/* Título y Subtítulo */}
      <div className="text-center w-full mb-10 lg:mb-12">
        <h1 className="font-bold text-[36px] md:text-[44px] leading-tight text-[#2D2D2D] mb-4">
          Regístrate
        </h1>
        <p className="text-[17px] md:text-lg text-gray-500 font-medium">
          Selecciona una opción para registrarte
        </p>
      </div>

      {/* Botón de Correo - Estilo Premium */}
      <button
        onClick={onEmailClick}
        className="w-full max-w-[340px] flex items-center justify-center gap-4 font-bold text-white bg-[#02819E] rounded-2xl py-4.5 px-6 text-[17px] shadow-lg shadow-[#02819E]/20 hover:bg-[#026c85] hover:-translate-y-1 transition-all duration-300 cursor-pointer mb-10"
        style={{ padding: "18px 24px" }}
      >
        <HiOutlineMail size={26} className="shrink-0" />
        <span>Con tu correo</span>
      </button>

      {/* Separador elegante */}
      <div className="text-center w-full mb-10">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-[0.1em]">
          Otras opciones de registro
        </span>
      </div>

      {/* Botón de Google - Limpio y con profundidad */}
      <button
        onClick={onGoogleClick}
        className="w-full max-w-[340px] flex items-center justify-center gap-4 font-bold bg-white text-[#2D2D2D] border border-gray-100 rounded-2xl py-4 px-6 text-[17px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer mb-12"
        style={{ padding: "16px 24px" }}
      >
        <FcGoogle size={28} className="shrink-0" />
        <span>Google</span>
      </button>

      {/* Footer link */}
      <div className="text-center w-full">
        <p className="text-[15px] md:text-base text-gray-600">
          Ya tengo una cuenta,{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#02819E] hover:underline"
          >
            iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSelectionView;

