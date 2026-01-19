"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { useAppDispatch } from "@shared/store/hooks";

import { useRouter } from "next/navigation";

import { sendOtp } from "@shared/services/authAPI";
import { setSignupData } from "../store/authSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import Tab from "@shared/components/Tab";

function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de email
    if (!isValidEmail(email)) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }

    // Validación de contraseña
    if (!isValidPassword(password)) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, router.push));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
    setTouched({ email: false, password: false });
  };

  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  // Determinar el estado de validación
  const emailValid = email.length > 0 && isValidEmail(email);
  const emailInvalid = touched.email && email.length > 0 && !isValidEmail(email);

  const passwordValid = password.length >= 6;
  const passwordInvalid = touched.password && password.length > 0 && password.length < 6;

  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          {/* First Name */}
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none"
            />
          </label>

          {/* Last Name */}
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none"
            />
          </label>
        </div>

        {/* Email Address */}
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <div className="relative">
            <input
              required
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
              onBlur={() => handleBlur("email")}
              placeholder="Enter email address"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none transition-all ${emailValid ? "ring-2 ring-green-500/50" : ""
                } ${emailInvalid ? "ring-2 ring-red-500/50" : ""}`}
            />
            {email.length > 0 && (
              <span className="absolute right-3 top-[14px]">
                {emailValid ? (
                  <HiCheckCircle className="text-green-500" size={20} />
                ) : emailInvalid ? (
                  <HiXCircle className="text-red-500" size={20} />
                ) : null}
              </span>
            )}
          </div>
          {emailInvalid && (
            <p className="mt-1 text-xs text-red-400">
              Por favor ingresa un correo electrónico válido
            </p>
          )}
        </label>

        <div className="flex gap-x-4">
          {/* Create Password */}
          <label className="relative flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                onBlur={() => handleBlur("password")}
                placeholder="Enter Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-20 text-richblack-5 outline-none transition-all ${passwordValid ? "ring-2 ring-green-500/50" : ""
                  } ${passwordInvalid ? "ring-2 ring-red-500/50" : ""}`}
              />
              <div className="absolute right-3 top-[14px] flex items-center gap-2">
                {password.length > 0 && (
                  <>
                    {passwordValid ? (
                      <HiCheckCircle className="text-green-500" size={20} />
                    ) : passwordInvalid ? (
                      <HiXCircle className="text-red-500" size={20} />
                    ) : null}
                  </>
                )}
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </div>
            </div>
            <p className={`mt-1 text-xs ${passwordValid ? "text-green-400" : passwordInvalid ? "text-red-400" : "text-richblack-400"}`}>
              {password.length > 0 ? (
                passwordValid ? (
                  "✓ Contraseña válida"
                ) : (
                  `${password.length}/6 caracteres mínimos`
                )
              ) : (
                "Mínimo 6 caracteres"
              )}
            </p>
          </label>

          {/* Confirm Password */}
          <label className="relative flex-1">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-colors"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
