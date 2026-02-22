import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { resetPassword } from "@modules/auth/services/authAPI";
import { RootState, AppDispatch } from "@shared/store/store";

export interface UseUpdatePasswordReturn {
  formData: {
    password: string;
    confirmPassword: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  mounted: boolean;
  token: string;
  isValidToken: boolean;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>, routerPush: (path: string) => void) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

/**
 * Hook para manejar el estado y lógica de actualización de contraseña.
 * Gestiona la validación del token y el formulario de reset de contraseña.
 */
export function useUpdatePassword(): UseUpdatePasswordReturn {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [mounted] = useState(() => typeof window !== "undefined");
  
  const getTokenFromPathname = () => {
    if (!pathname) return "";
    const pathParts = pathname.split("/").filter(Boolean);
    const tokenIndex = pathParts.findIndex(part => 
      part === "update-password" || part === "auth"
    );
    if (tokenIndex >= 0 && pathParts[tokenIndex + 1]) {
      return pathParts[tokenIndex + 1];
    }
    return pathname.split("/").at(-1) || "";
  };
  
  const [token] = useState<string>(() => getTokenFromPathname());
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const currentToken = token;
  const isValidToken = Boolean(mounted && token && token.trim() !== "");
  const isLoading = loading || !mounted;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>, routerPush: (path: string) => void) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan antes de enviar
    if (formData.password !== formData.confirmPassword) {
      return; // El error se mostrará en la función resetPassword
    }

    // Validar que el token exista
    const tokenToUse = token || currentToken;
    if (!tokenToUse || tokenToUse.trim() === "") {
      return; // El error se mostrará en la función resetPassword
    }

    dispatch(
      resetPassword(
        formData.password,
        formData.confirmPassword,
        tokenToUse,
        routerPush
      )
    );
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    loading: isLoading,
    mounted,
    token: currentToken,
    isValidToken,
    handleOnChange,
    handleOnSubmit,
    setShowPassword,
    setShowConfirmPassword,
  };
}


