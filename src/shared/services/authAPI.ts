import { toast } from "react-hot-toast"

import { setLoading, setToken } from "@modules/auth/store/authSlice"
import { resetCart } from "@modules/course/store/cartSlice"
import { setUser } from "@modules/auth/store/profileSlice"
import { apiConnector } from "./apiConnector"
import { endpoints } from "./apis"
import type { AppDispatch } from "@shared/store/store"
import type { NavigateFunction, ApiError } from "@modules/auth/types"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

// API Response Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  warning?: string;
  resetUrl?: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  accountType?: string;
  [key: string]: unknown;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: UserData;
}

// ================ send Otp ================
/**
 * Envía un código OTP al email del usuario usando Brevo
 * 
 * NOTA: El envío real del email se hace en el backend usando Brevo.
 * Este frontend solo hace la petición HTTP al backend.
 */
export function sendOtp(email: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Enviando código de verificación...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector<ApiResponse>("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      // console.log("SENDOTP API RESPONSE ---> ", response)

      // console.log(response.data.success)
      if (!response.data.success) {
        throw new Error(response.data.message || "Could not send OTP");
      }

      navigate("/auth/verify-email");
      toast.success("Código de verificación enviado exitosamente");
    } catch (error) {
      console.log("SENDOTP API ERROR --> ", error);
      const apiError = error as ApiError;

      // Mensajes de error más específicos
      const errorMessage = apiError.response?.data?.message || "";

      if (errorMessage.includes("email service") || errorMessage.includes("servicio de correo")) {
        toast.error("Error en el servicio de correo. Por favor, intenta más tarde.");
      } else if (errorMessage.includes("not registered") || errorMessage.includes("no registrado")) {
        toast.error("Este email no está registrado en nuestro sistema");
      } else {
        toast.error(errorMessage || "No se pudo enviar el código de verificación");
      }
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// ================ send Otp for Signup (Nuevo flujo) ================
/**
 * Envía un código OTP al email del usuario para registro
 * NO navega automáticamente, solo envía el OTP
 */
export function sendOtpForSignup(email: string) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Enviando código de verificación...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector<ApiResponse & { otp?: string }>("POST", SENDOTP_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "No se pudo enviar el código OTP");
      }

      toast.success(response.data.message || "Código de verificación enviado exitosamente");
      
      // En desarrollo, mostrar el OTP en consola si viene en la respuesta
      if (response.data.otp && process.env.NODE_ENV === "development") {
        console.log("🔑 OTP (solo desarrollo):", response.data.otp);
      }

      return { success: true, message: response.data.message, otp: response.data.otp };
    } catch (error) {
      console.log("SENDOTP FOR SIGNUP API ERROR --> ", error);
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || "";

      if (errorMessage.includes("ya está registrado") || errorMessage.includes("Already Registered")) {
        toast.error("Este email ya está registrado. Por favor, inicia sesión.");
      } else if (errorMessage.includes("email") || errorMessage.includes("correo")) {
        toast.error(errorMessage || "Error al enviar el código de verificación");
      } else {
        toast.error(errorMessage || "No se pudo enviar el código de verificación");
      }

      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ================ sign Up (Nuevo flujo simplificado) ================
/**
 * Registra un nuevo usuario con el nuevo formato de API
 * Campos: name, email, password, otp
 */
export function signUpNew(
  name: string,
  email: string,
  password: string,
  otp: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Registrando usuario...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector<ApiResponse>("POST", SIGNUP_API, {
        name,
        email,
        password,
        otp,
      });

      if (!response.data.success) {
        const errorMsg = response.data.message || "Error al registrar usuario";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success(response.data.message || "Usuario registrado exitosamente");
      navigate("/auth/login");
    } catch (error) {
      const apiError = error as ApiError;
      console.log("SIGNUP NEW API ERROR --> ", apiError);
      
      const errorMessage = apiError.response?.data?.message || "";
      
      if (errorMessage.includes("OTP") || errorMessage.includes("otp")) {
        if (errorMessage.includes("expirado") || errorMessage.includes("expired")) {
          toast.error("El código OTP ha expirado. Por favor, solicita uno nuevo.");
        } else {
          toast.error("Código OTP inválido. Verifica el código e intenta nuevamente.");
        }
      } else if (errorMessage.includes("ya está registrado") || errorMessage.includes("Already Registered")) {
        toast.error("Este email ya está registrado. Por favor, inicia sesión.");
      } else if (apiError.response?.data?.errors) {
        const validationErrors = apiError.response.data.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const firstError = validationErrors[0];
          if (firstError && typeof firstError === 'object' && 'constraints' in firstError && firstError.constraints) {
            const constraintMessage = Object.values(firstError.constraints)[0];
            toast.error(constraintMessage as string);
          } else {
            toast.error(errorMessage || "Error de validación");
          }
        } else {
          toast.error(errorMessage || "Error de validación");
        }
      } else {
        toast.error(errorMessage || "Error al registrar usuario");
      }

      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ================ sign Up (Método antiguo - mantener para compatibilidad) ================
export function signUp(
  accountType: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  otp: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<ApiResponse>("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      // console.log("SIGNUP API RESPONSE --> ", response);
      if (!response.data.success) {
        const errorMsg = response.data.message || "Signup failed";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success("Signup Successful");
      navigate("/auth/login");
    } catch (error) {
      const apiError = error as ApiError;
      console.log("SIGNUP API ERROR --> ", apiError);
      toast.error(apiError.response?.data?.message || "Invalid OTP");
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ Login ================
export function login(email: string, password: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector<LoginResponse>("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed")
      }

      toast.success("Inicio de sesión exitoso")
      dispatch(setToken(response.data.token))

      const userImage = response.data.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      dispatch(setUser({ ...response.data.user, image: userImage }));
      // console.log('User data - ', response.data.user);/
      localStorage.setItem("token", JSON.stringify(response.data.token));

      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }));

      navigate("/dashboard/my-profile");
    } catch (error) {
      const apiError = error as ApiError;
      console.log("LOGIN API ERROR.......", apiError)

      // Obtener mensaje de error del backend
      const errorMessage = apiError.response?.data?.message || apiError.message || "";

      // Manejar errores específicos con mensajes en español
      if (errorMessage.includes("pendiente de aprobación") || errorMessage.includes("pending approval")) {
        toast.error(
          "Tu cuenta de instructor está pendiente de aprobación. " +
          "Por favor, espera a que el administrador apruebe tu cuenta antes de iniciar sesión.",
          { id: 'pending-approval-login' }
        );
      } else if (errorMessage.includes("desactivada") || errorMessage.includes("desactivado") || errorMessage.includes("inactiva")) {
        toast.error(
          "Tu cuenta ha sido desactivada. Por favor, contacta al administrador.",
          { id: 'account-deactivated-login' }
        );
      } else if (errorMessage.includes("email no está registrado") || errorMessage.includes("no está registrado") || errorMessage.includes("not registered") || errorMessage.includes("no encontrado")) {
        toast.error(
          "Este correo no se encuentra registrado. Por favor, verifica tu correo o regístrate.",
          { id: 'email-not-found' }
        );
      } else if (errorMessage.includes("contraseña es incorrecta") || errorMessage.includes("contraseña incorrecta")) {
        toast.error(
          "La contraseña es incorrecta. Por favor, verifica tu contraseña.",
          { id: 'wrong-password' }
        );
      } else if (errorMessage.includes("Invalid credentials") || errorMessage.includes("credenciales inválidas")) {
        // Mensaje genérico solo si no hay mensaje más específico
        toast.error(
          "Credenciales inválidas. Verifica tu email y contraseña.",
          { id: 'invalid-credentials' }
        );
      } else {
        // Mensaje por defecto en español
        toast.error(
          errorMessage || "Error al iniciar sesión. Por favor, intenta nuevamente.",
          { id: 'login-error' }
        );
      }
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ get Password Reset Token ================
export function getPasswordResetToken(email: string, setEmailSent: (sent: boolean) => void) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Enviando email...")
    dispatch(setLoading(true))
    try {
      // Obtener la URL del frontend (window.location.origin)
      const frontendUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const response = await apiConnector<ApiResponse>("POST", RESETPASSTOKEN_API, {
        email,
        frontendUrl, // Enviar la URL del frontend
      })

      console.log("RESET PASS TOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message || "Could not send reset token")
      }

      // Si hay un warning (desarrollo sin correo configurado), mostrarlo
      if (response.data.warning) {
        toast.success(response.data.message || "Token generado (solo para desarrollo)")
        console.warn("⚠️", response.data.warning)
        if (response.data.resetUrl) {
          console.log("🔗 Reset URL (solo desarrollo):", response.data.resetUrl)
        }
      } else {
        toast.success(response.data.message || "Email enviado exitosamente. Revisa tu correo.")
      }

      setEmailSent(true)
    } catch (error) {
      const apiError = error as ApiError;
      console.log("RESET PASS TOKEN ERROR............", apiError)

      const errorMessage = apiError.response?.data?.message || "";

      // Manejar errores específicos
      if (errorMessage.includes("not registered") || errorMessage.includes("no está registrado")) {
        toast.error("Este email no está registrado en nuestro sistema")
      } else if (errorMessage.includes("correo no configurado") || errorMessage.includes("email service not configured")) {
        toast.error("Servicio de correo no configurado. Contacta al administrador.")
      } else {
        toast.error(errorMessage || "Error al solicitar reset de contraseña")
      }
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ reset Password ================
export function resetPassword(password: string, confirmPassword: string, token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    // Validar que las contraseñas coincidan antes de enviar
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return;
    }

    // Validar que el token no esté vacío
    if (!token || token.trim() === "") {
      toast.error("Token inválido. Por favor, solicita un nuevo link de reset.")
      return;
    }

    const toastId = toast.loading("Actualizando contraseña...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector<ApiResponse>("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message || "Could not reset password")
      }

      toast.success(response.data.message || "Contraseña actualizada exitosamente")
      navigate("/auth/login")
    } catch (error) {
      const apiError = error as ApiError;
      console.log("RESETPASSWORD ERROR............", apiError)

      const errorMessage = apiError.response?.data?.message || "";

      // Manejar errores específicos
      if (errorMessage.includes("expired") || errorMessage.includes("expirado")) {
        toast.error("El link ha expirado. Por favor, solicita un nuevo link de reset. (El token expira en 5 minutos)")
      } else if (errorMessage.includes("not matched") || errorMessage.includes("no coincide")) {
        toast.error("Token inválido o expirado. Por favor, solicita un nuevo link de reset.")
      } else if (errorMessage.includes("Passwords are not matched") || errorMessage.includes("no coinciden")) {
        toast.error("Las contraseñas no coinciden")
      } else {
        toast.error(errorMessage || "Error al actualizar la contraseña")
      }
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ Logout ================
export function logout(navigate: NavigateFunction) {
  return (dispatch: AppDispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Sesión cerrada exitosamente")
    navigate("/")
  }
}