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
// ========== TEMPORAL: Agregar accountType como parámetro opcional ==========
// TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS
export function login(email: string, password: string, navigate: NavigateFunction, accountType?: "Student" | "Instructor" | "Admin") {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // ========== TEMPORAL: Login rápido con cualquier correo ==========
      // TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS
      if (accountType) {
        // Extraer nombre del email (parte antes del @)
        const emailName = email.split("@")[0] || "User";
        const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        
        // Determinar lastName según el tipo de cuenta
        let lastName = "User";
        if (accountType === "Student") {
          lastName = "Student";
        } else if (accountType === "Instructor") {
          lastName = "Instructor";
        } else if (accountType === "Admin") {
          lastName = "Admin";
        }
        
        const mockUser = {
          _id: `temp_${accountType.toLowerCase()}_${Date.now()}`,
          firstName: firstName,
          lastName: lastName,
          email: email,
          accountType: accountType,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${accountType}`
        };
        
        toast.success(`Login Successful (Temporal ${accountType})`);
        dispatch(setToken(`temp_token_${Date.now()}`));
        dispatch(setUser(mockUser));
        localStorage.setItem("token", JSON.stringify(`temp_token_${Date.now()}`));
        localStorage.setItem("user", JSON.stringify(mockUser));
        navigate("/dashboard/my-profile");
        dispatch(setLoading(false));
        toast.dismiss(toastId);
        return;
      }
      // ============================================================

      if (email === "admin@test.com" && password === "123456") {
        // Mock Admin Login
        toast.success("Login Successful (Demo Admin)")
        const mockAdmin = {
          _id: "admin_id_123",
          firstName: "Admin",
          lastName: "User",
          email: "admin@test.com",
          accountType: "Admin",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=Admin%20User"
        }
        dispatch(setToken("mock_admin_token"))
        dispatch(setUser(mockAdmin))
        localStorage.setItem("token", JSON.stringify("mock_admin_token"))
        localStorage.setItem("user", JSON.stringify(mockAdmin))
        navigate("/dashboard/my-profile")
        dispatch(setLoading(false))
        toast.dismiss(toastId)
        return
      }

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
      toast.error(apiError.response?.data?.message || "Login Failed");
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ get Password Reset Token ================
export function getPasswordResetToken(email: string, setEmailSent: (sent: boolean) => void) {
  return async (dispatch: AppDispatch) => {

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESET PASS TOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      const apiError = error as ApiError;
      console.log("RESET PASS TOKEN ERROR............", apiError)
      toast.error(apiError.response?.data?.message || "Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ reset Password ================
export function resetPassword(password: string, confirmPassword: string, token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...")
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

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      const apiError = error as ApiError;
      console.log("RESETPASSWORD ERROR............", apiError)
      toast.error(apiError.response?.data?.message || "Failed To Reset Password");
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