import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@shared/store/hooks";
import { login } from "@shared/services/authAPI";
import { API_URL } from "@shared/config/api.config";
import {
  isValidEmail as validateEmail,
  isValidPassword as validatePassword,
} from "../../register/utils/validation";

export interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (): Promise<boolean> => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return false;
    }

    if (!validateEmail(formData.email)) {
      return false;
    }

    if (!validatePassword(formData.password)) {
      return false;
    }

    setIsLoading(true);
    try {
      await dispatch(
        login(
          formData.email,
          formData.password,
          router.push as (path: string) => void
        )
      );
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const emailIsValid = formData.email === "" || validateEmail(formData.email);
  const passwordIsValid =
    formData.password === "" || validatePassword(formData.password);
  const isFormValid =
    formData.email.trim() &&
    formData.password.trim() &&
    emailIsValid &&
    passwordIsValid;

  return {
    formData,
    showPassword,
    isLoading,
    touchedFields,
    updateFormData,
    setShowPassword,
    handleLogin,
    handleGoogleLogin,
    handleBlur,
    isValidEmail: validateEmail,
    isValidPassword: validatePassword,
    emailIsValid,
    passwordIsValid,
    isFormValid,
  };
};
