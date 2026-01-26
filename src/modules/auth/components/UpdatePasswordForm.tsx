// Componente presentacional para el formulario de update password
import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { Loading } from "@shared/components";
import { AUTH_TEXTS } from "../constants/auth.constants";

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
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="max-w-[500px] p-4 lg:p-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="max-w-[500px] p-4 lg:p-8 text-center">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 mb-4">
            {AUTH_TEXTS.updatePassword.invalidToken.title}
          </h1>
          <p className="text-richblack-300 mb-6">
            {AUTH_TEXTS.updatePassword.invalidToken.message}
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            {AUTH_TEXTS.updatePassword.invalidToken.button}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          {AUTH_TEXTS.updatePassword.title}
        </h1>

        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          {AUTH_TEXTS.updatePassword.description}
        </p>

        <form onSubmit={onSubmit}>
          <label className="relative block">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={onFormDataChange}
                placeholder="Enter Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
              />
              <span
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
          </label>

          <label className="relative mt-3 block">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onFormDataChange}
                placeholder="Confirm Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
              />
              <span
                onClick={onToggleConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
          >
            Reset Password
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
    </div>
  );
}


