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
    <div className="w-full flex flex-col items-center">
      {/* Título */}
      <div className="text-center w-full mb-6">
        <h1 className="font-bold text-[2.25rem] leading-[2.75rem] text-[#333333] mb-2">
          Regístrate
        </h1>
        <p className="text-base leading-6 text-gray-500 m-0">
          Selecciona una opción para registrarte
        </p>
      </div>

      {/* Botón de registro con correo */}
      <button
        onClick={onEmailClick}
        className="w-[296px] flex items-center justify-center gap-3 font-medium text-white bg-[#14b8a6] rounded-full py-2.5 px-3.5 text-base leading-6 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
      >
        <HiOutlineMail className="w-6 h-6 shrink-0 text-white" />
        <span>Con tu correo</span>
      </button>

      {/* Separador sin líneas */}
      <div className="text-center w-full my-4">
        <span className="text-sm leading-5 text-gray-500">
          Otras opciones de registro
        </span>
      </div>

      {/* Botón de Google */}
      <button
        onClick={onGoogleClick}
        className="w-[296px] flex items-center justify-center gap-3 font-medium bg-white text-gray-700 rounded-full py-2.5 px-3.5 text-base leading-6 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <FcGoogle className="w-6 h-6 shrink-0" />
        <span>Google</span>
      </button>

      {/* Link para iniciar sesión */}
      <div className="text-center w-full mt-4">
        <p className="text-sm leading-5 text-gray-600 m-0">
          Ya tengo una cuenta,{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#02819E] no-underline"
          >
            iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSelectionView;
