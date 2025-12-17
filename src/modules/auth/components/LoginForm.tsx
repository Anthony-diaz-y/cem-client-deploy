"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@shared/services/authAPI";
import { AppDispatch } from "@shared/store/store";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  
  // ========== TEMPORAL: Selector de tipo de cuenta para login rápido ==========
  // TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS
  const [accountType, setAccountType] = useState<"Student" | "Instructor" | "Admin">(ACCOUNT_TYPE.STUDENT);
  // ============================================================================

  const { email, password } = formData;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ========== TEMPORAL: Pasar accountType al login ==========
    // TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS
    dispatch(login(email, password, router.push as (path: string) => void, accountType));
    // ============================================================
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      {/* ========== TEMPORAL: Selector de tipo de cuenta ========== */}
      {/* TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS */}
      <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="mb-2 text-[0.875rem] text-yellow-200 font-semibold">
          🔧 MODO TEMPORAL - Login con cualquier correo
        </p>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="accountType"
              value={ACCOUNT_TYPE.STUDENT}
              checked={accountType === ACCOUNT_TYPE.STUDENT}
              onChange={(e) => setAccountType(e.target.value as "Student" | "Instructor" | "Admin")}
              className="w-4 h-4"
            />
            <span className="text-richblack-5 text-sm">Estudiante</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="accountType"
              value={ACCOUNT_TYPE.INSTRUCTOR}
              checked={accountType === ACCOUNT_TYPE.INSTRUCTOR}
              onChange={(e) => setAccountType(e.target.value as "Student" | "Instructor" | "Admin")}
              className="w-4 h-4"
            />
            <span className="text-richblack-5 text-sm">Instructor</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="accountType"
              value={ACCOUNT_TYPE.ADMIN}
              checked={accountType === ACCOUNT_TYPE.ADMIN}
              onChange={(e) => setAccountType(e.target.value as "Student" | "Instructor" | "Admin")}
              className="w-4 h-4"
            />
            <span className="text-richblack-5 text-sm">Administrador</span>
          </label>
        </div>
      </div>
      {/* ============================================================ */}

      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none"
        />
      </label>

      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5 outline-none"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link href="/auth/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
