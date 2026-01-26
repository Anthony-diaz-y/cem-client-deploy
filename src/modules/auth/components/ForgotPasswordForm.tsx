// Componente presentacional para el formulario de forgot password
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { Loading } from "@shared/components";
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
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? AUTH_TEXTS.forgotPassword.title.default : AUTH_TEXTS.forgotPassword.title.emailSent}
          </h1>
          <div className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!emailSent ? (
              <div>
                <p className="mb-2">
                  {AUTH_TEXTS.forgotPassword.description.default}
                </p>
                <p className="text-sm text-richblack-400">
                  {AUTH_TEXTS.forgotPassword.description.warning}
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-2">
                  {AUTH_TEXTS.forgotPassword.description.emailSent}{" "}
                  <span className="text-yellow-200 font-semibold">{email}</span>
                </p>
                <p className="text-sm text-richblack-400">
                  {AUTH_TEXTS.forgotPassword.description.emailSentInstruction}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="Enter email address"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 "
                />
              </label>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              {!emailSent ? AUTH_TEXTS.forgotPassword.button.submit : AUTH_TEXTS.forgotPassword.button.resend}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link href="/auth/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


