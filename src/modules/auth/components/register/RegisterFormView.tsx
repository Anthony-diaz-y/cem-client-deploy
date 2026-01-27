"use client";

import React from "react";
import { useRegisterForm } from "./hooks";
import { RegisterFormStep, VerifyOtpStep } from "./steps";

interface RegisterFormViewProps {
  onBack?: () => void;
}

const RegisterFormView: React.FC<RegisterFormViewProps> = ({ onBack }) => {
  const {
    step,
    formData,
    otp,
    isLoading,
    updateFormData,
    setOtp,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    goBackToRegister,
    isValidEmail,
    isValidPassword,
  } = useRegisterForm();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerifyOtp();
  };

  if (step === "register") {
    return (
      <RegisterFormStep
        formData={formData}
        isLoading={isLoading}
        onInputChange={updateFormData}
        onSubmit={handleRegisterSubmit}
        onBack={onBack}
        isValidEmail={isValidEmail}
        isValidPassword={isValidPassword}
      />
    );
  }

  return (
    <VerifyOtpStep
      email={formData.correo}
      otp={otp}
      isLoading={isLoading}
      onOtpChange={setOtp}
      onSubmit={handleVerifySubmit}
      onResendOtp={handleResendOtp}
      onBack={goBackToRegister}
    />
  );
};

export default RegisterFormView;
