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

// ================ send Otp ================
export function sendOtp(email: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      // console.log("SENDOTP API RESPONSE ---> ", response)

      // console.log(response.data.success)
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      navigate("/auth/verify-email");
      toast.success("OTP Sent Successfully");
    } catch (error) {
      console.log("SENDOTP API ERROR --> ", error);
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// ================ sign Up ================
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
      const response = await apiConnector("POST", SIGNUP_API, {
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
        toast.error(response.data.message);
        throw new Error(response.data.message);
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
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      dispatch(setUser({ ...response.data.user, image: userImage }));
      // console.log('User data - ', response.data.user);/
      localStorage.setItem("token", JSON.stringify(response.data?.token));

      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }));

      navigate("/dashboard/my-profile");
    } catch (error) {
      const apiError = error as ApiError;
      console.log("LOGIN API ERROR.......", apiError)
      
      // Manejar error específico de instructor no aprobado
      const errorMessage = apiError.response?.data?.message || "";
      if (errorMessage.includes("pending approval") || errorMessage.includes("pendiente de aprobación")) {
        toast.error(
          "Tu cuenta de instructor está pendiente de aprobación. " +
          "Por favor, espera a que el administrador apruebe tu cuenta antes de iniciar sesión."
        );
      } else {
        toast.error(errorMessage || "Login Failed");
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

      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
        frontendUrl, // Enviar la URL del frontend
      })

      console.log("RESET PASS TOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
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
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
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
    toast.success("Logged Out")
    navigate("/")
  }
}