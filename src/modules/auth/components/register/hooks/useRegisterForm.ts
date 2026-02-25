import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@shared/store/hooks";
import { sendOtpForSignup, signUpNew } from "@modules/auth/services/authAPI";
import {
  isValidEmail as validateEmail,
  isValidPassword as validatePassword,
  isValidOtp,
} from "../utils/validation";

export type RegisterStep = "register" | "verify";

export interface RegisterFormData {
  nombres: string;
  correo: string;
  contraseña: string;
}

export const useRegisterForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<RegisterStep>("register");
  const [formData, setFormData] = useState<RegisterFormData>({
    nombres: "",
    correo: "",
    contraseña: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (): Promise<boolean> => {
    if (
      !formData.nombres.trim() ||
      !validateEmail(formData.correo) ||
      !validatePassword(formData.contraseña)
    ) {
      return false;
    }

    setIsLoading(true);
    try {
      await dispatch(sendOtpForSignup(formData.correo, formData.nombres));
      setStep("verify");
      return true;
    } catch (error) {
      console.error("Error al enviar OTP:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<boolean> => {
    if (!isValidOtp(otp)) {
      return false;
    }

    setIsLoading(true);
    try {
      await dispatch(
        signUpNew(
          formData.nombres,
          formData.correo,
          formData.contraseña,
          otp,
          router.push as (path: string) => void,
        ),
      );
      return true;
    } catch (error) {
      console.error("Error al registrar:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await dispatch(sendOtpForSignup(formData.correo, formData.nombres));
    } catch (error) {
      console.error("Error al reenviar OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToRegister = () => {
    setStep("register");
    setOtp("");
  };

  return {
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
    isValidEmail: validateEmail,
    isValidPassword: validatePassword,
  };
};
