// Componente presentacional para el formulario de forgot password
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { AUTH_TEXTS } from "../constants/auth.constants";

interface ForgotPasswordFormProps {
  email: string;
  emailSent: boolean;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ForgotPasswordForm({
  email,
  emailSent,
  loading,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-white">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="spinner border-t-cem-primary"></div>
          <p className="text-cem-neutral-gray-600 font-medium">Cargando...</p>
        </div>
      ) : (
        <div className="max-w-[450px] w-full p-6 lg:p-10 bg-white rounded-2xl border border-cem-neutral-gray-100 shadow-xl shadow-cem-neutral-gray-100/50">
          <h1 className="text-3xl font-bold tracking-tight text-cem-neutral-gray-900 mb-2">
            {!emailSent
              ? AUTH_TEXTS.forgotPassword.title.default
              : AUTH_TEXTS.forgotPassword.title.emailSent}
          </h1>

          <div className="mt-4 mb-8">
            {!emailSent ? (
              <div className="flex flex-col gap-3 text-base leading-relaxed text-cem-neutral-gray-600">
                <p>{AUTH_TEXTS.forgotPassword.description.default}</p>
                <div className="p-3 bg-cem-teal-50 rounded-lg border border-cem-teal-100">
                  <p className="text-sm text-cem-primary font-medium">
                    {AUTH_TEXTS.forgotPassword.description.warning}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-base leading-relaxed text-cem-neutral-gray-600">
                <p>
                  {AUTH_TEXTS.forgotPassword.description.emailSent}{" "}
                  <span className="text-cem-primary font-bold">{email}</span>
                </p>
                <p className="text-sm p-3 bg-cem-teal-50 rounded-lg border border-cem-teal-100 font-medium text-cem-primary">
                  {AUTH_TEXTS.forgotPassword.description.emailSentInstruction}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            {!emailSent && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-cem-neutral-gray-700"
                >
                  {AUTH_TEXTS.forgotPassword.fields.email.label}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder={
                    AUTH_TEXTS.forgotPassword.fields.email.placeholder
                  }
                  className="w-full rounded-xl border border-cem-neutral-gray-200 bg-white p-3.5 text-cem-neutral-gray-900 focus:outline-none focus:ring-2 focus:ring-cem-primary/20 focus:border-cem-primary transition-all placeholder:text-cem-neutral-gray-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-cem-primary py-4 px-6 font-bold text-white shadow-lg shadow-cem-primary/20 hover:bg-cem-primary-dark hover:shadow-xl transition-all active:scale-[0.98]"
            >
              {!emailSent
                ? AUTH_TEXTS.forgotPassword.button.submit
                : AUTH_TEXTS.forgotPassword.button.resend}
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
      )}
    </div>
  );
}
