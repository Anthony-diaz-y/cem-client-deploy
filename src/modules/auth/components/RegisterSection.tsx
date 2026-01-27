"use client";

import React, { useState } from "react";
import { API_URL } from "@shared/config/api.config";
import {
  RegisterImagePanel,
  RegisterSelectionView,
  RegisterFormView,
} from "./register";

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
    <div className="fixed inset-0 flex bg-white overflow-hidden text-base">
      {/* Panel izquierdo - Imagen del estudiante */}
      <RegisterImagePanel />

      {/* Panel derecho - Formulario de registro */}
      <div className="h-full w-1/2 min-w-0 flex items-center justify-center bg-white overflow-y-auto p-8">
        <div className="w-full max-w-[28rem] flex flex-col items-center py-8">
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
  );
};

export default RegisterSection;

