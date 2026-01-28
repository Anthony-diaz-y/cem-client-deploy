"use client";

import React from "react";
import { useLoginForm } from "../hooks";
import {
  LoginFormHeader,
  GoogleButton,
  FormSeparator,
  RegisterLink,
} from "../components";
import { EmailInput, PasswordInput, FormButton } from "../../register/components";

const LoginFormView: React.FC = () => {
  const {
    formData,
    showPassword,
    isLoading,
    touchedFields,
    updateFormData,
    setShowPassword,
    handleLogin,
    handleGoogleLogin,
    handleBlur,
    emailIsValid,
    passwordIsValid,
    isFormValid,
  } = useLoginForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData(name as keyof typeof formData, value);

    if (name === "email" || name === "password") {
      handleBlur(name);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    updateFormData("password", value);
    handleBlur("password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <LoginFormHeader title="Inicia sesión" subtitle="Bienvenido nuevamente" />

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <EmailInput
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleBlur("email")}
          placeholder="Correo"
          required
          disabled={isLoading}
          isValid={emailIsValid}
          showValidationMessage={touchedFields.email}
        />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur("password")}
          placeholder="Contraseña"
          required
          disabled={isLoading}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword(!showPassword)}
          showValidationMessage={touchedFields.password}
          isValid={passwordIsValid}
        />

        <FormButton type="submit" disabled={!isFormValid} isLoading={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </FormButton>

        <FormSeparator />

        <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />
      </form>

      <div className="mt-4">
        <RegisterLink />
      </div>
    </div>
  );
};

export default LoginFormView;

