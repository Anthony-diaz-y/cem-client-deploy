// Hook para manejar el estado y lógica de VerifyEmail
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import { AppDispatch } from "@shared/store/store";
import { sendOtp, signUp } from "@shared/services/authAPI";
import type { SignupData } from "../types";

export interface UseVerifyEmailReturn {
  otp: string;
  loading: boolean;
  signupData: SignupData | null;
  setOtp: (otp: string) => void;
  handleVerifyAndSignup: (e: React.FormEvent<HTMLFormElement>) => void;
  handleResendOtp: () => void;
}

export function useVerifyEmail(): UseVerifyEmailReturn {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { signupData, loading } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      router.push("/auth/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signupData) return;

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        router.push as (path: string) => void
      )
    );
  };

  const handleResendOtp = () => {
    if (!signupData) return;
    const email = (signupData as SignupData).email;
    dispatch(sendOtp(email, router.push as (path: string) => void));
    setOtp("");
  };

  return {
    otp,
    loading,
    signupData,
    setOtp,
    handleVerifyAndSignup,
    handleResendOtp,
  };
}


