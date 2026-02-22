// Componente presentacional para el formulario de update password
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { Loading } from "@shared/components";
import { AUTH_TEXTS } from "../constants/auth.constants";
import PasswordInput from "./register/components/PasswordInput";
import { isValidPassword } from "./register/utils/validation";

interface UpdatePasswordFormProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  isValidToken: boolean;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export default function UpdatePasswordForm({
  formData,
  showPassword,
  showConfirmPassword,
  loading,
  isValidToken,
  onFormDataChange,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
}: UpdatePasswordFormProps) {
  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-white">
        <Loading />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-white">
        <div className="max-w-[450px] w-full p-6 lg:p-10 bg-white rounded-2xl border border-cem-neutral-gray-100 shadow-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-cem-neutral-gray-900 mb-4">
            {AUTH_TEXTS.updatePassword.invalidToken.title}
          </h1>
          <p className="text-cem-neutral-gray-600 mb-8">
            {AUTH_TEXTS.updatePassword.invalidToken.message}
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block w-full rounded-xl bg-cem-primary py-4 px-6 font-bold text-white shadow-lg shadow-cem-primary/20 hover:bg-cem-primary-dark transition-all"
          >
            {AUTH_TEXTS.updatePassword.invalidToken.button}
          </Link>
        </div>
      </div>
    );
  }

  const isFormValid =
    isValidPassword(formData.password) &&
    formData.password === formData.confirmPassword;

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-white">
      <div className="max-w-[450px] w-full p-6 lg:p-10 bg-white rounded-2xl border border-cem-neutral-gray-100 shadow-xl shadow-cem-neutral-gray-100/50">
        <h1 className="text-3xl font-bold tracking-tight text-cem-neutral-gray-900 mb-2">
          {AUTH_TEXTS.updatePassword.title}
        </h1>

        <p className="mt-4 mb-8 text-base leading-relaxed text-cem-neutral-gray-600">
          {AUTH_TEXTS.updatePassword.description}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-6 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cem-neutral-gray-700">
              Nueva contraseña <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={onFormDataChange}
              placeholder="Ingresa tu nueva contraseña"
              showPassword={showPassword}
              onToggleVisibility={onTogglePassword}
              showRequirements={true}
              isValid={
                isValidPassword(formData.password) || formData.password === ""
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cem-neutral-gray-700">
              Confirmar nueva contraseña <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onFormDataChange}
              placeholder="Confirma tu contraseña"
              showPassword={showConfirmPassword}
              onToggleVisibility={onToggleConfirmPassword}
              isValid={
                formData.password === formData.confirmPassword ||
                formData.confirmPassword === ""
              }
              errorMessage="Las contraseñas no coinciden"
              showValidationMessage={
                formData.confirmPassword !== "" &&
                formData.password !== formData.confirmPassword
              }
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="mt-4 w-full rounded-xl bg-cem-primary py-4 px-6 font-bold text-white shadow-lg shadow-cem-primary/20 hover:bg-cem-primary-dark hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Restablecer contraseña
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center border-t border-cem-neutral-gray-100 pt-6">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-cem-neutral-gray-500 hover:text-cem-primary font-medium transition-colors group"
          >
            <BiArrowBack className="group-hover:-translate-x-1 transition-transform" />
            {AUTH_TEXTS.forgotPassword.links.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
