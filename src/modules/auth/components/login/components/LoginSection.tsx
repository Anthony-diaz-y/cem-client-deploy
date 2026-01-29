"use client";

import React from "react";
import LoginImagePanel from "./LoginImagePanel";
import LoginFormView from "./LoginFormView";

const LoginSection: React.FC = () => {
  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFB] overflow-x-hidden lg:overflow-hidden text-base relative">
      {/* Panel Superior/Izquierdo - Imagen de Impacto */}
      <LoginImagePanel />

      {/* Panel Inferior/Derecho - Contenedor de Formulario Flotante */}
      <div className="relative flex-1 w-full lg:w-1/2 flex items-start lg:items-center justify-center lg:bg-white z-20">
        <div
          className="w-full h-full lg:h-auto bg-white rounded-t-[3rem] lg:rounded-none -mt-16 lg:mt-0 p-8 md:p-12 lg:p-16 flex flex-col items-center overflow-y-auto lg:overflow-visible"
          style={{ minHeight: "60vh" }}
        >
          <div className="w-full max-w-[400px] lg:max-w-[440px] flex flex-col items-center">
            <LoginFormView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;

