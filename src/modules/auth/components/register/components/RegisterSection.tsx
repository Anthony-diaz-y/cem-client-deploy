"use client";

import React, { useState } from "react";
import { API_URL } from "@shared/config/api.config";
import RegisterImagePanel from "./RegisterImagePanel";
import RegisterSelectionView from "./RegisterSelectionView";
import RegisterFormView from "./RegisterFormView";

const RegisterSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleEmailClick = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFB] overflow-x-hidden lg:overflow-hidden text-base relative">
      {/* Panel Superior/Izquierdo - Imagen de Impacto */}
      <RegisterImagePanel />

      {/* Panel Inferior/Derecho - Contenedor de Formulario Flotante */}
      <div className="relative flex-1 w-full lg:w-1/2 flex items-start lg:items-center justify-center lg:bg-white z-20">
        <div
          className="w-full h-full lg:h-auto bg-white rounded-t-[3rem] lg:rounded-none -mt-16 lg:mt-0 p-8 md:p-12 lg:p-16 flex flex-col items-center overflow-y-auto lg:overflow-visible"
          style={{ minHeight: "60vh" }}
        >
          <div className="w-full max-w-[400px] lg:max-w-[440px] flex flex-col items-center">
            {!showForm ? (
              <RegisterSelectionView
                onEmailClick={handleEmailClick}
                onGoogleClick={handleGoogleSignup}
              />
            ) : (
              <RegisterFormView onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;

