// Hook para manejar el estado y lógica de ForgotPassword
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";
import { getPasswordResetToken } from "@modules/auth/services/authAPI";

export interface UseForgotPasswordReturn {
  email: string;
  emailSent: boolean;
  loading: boolean;
  setEmail: (email: string) => void;
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return {
    email,
    emailSent,
    loading,
    setEmail,
    handleOnSubmit,
  };
}


