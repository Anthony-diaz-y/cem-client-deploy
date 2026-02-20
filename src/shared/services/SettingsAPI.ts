import { toast } from "react-hot-toast"

import { setUser } from "@modules/auth/store/profileSlice"
import { apiConnector } from "./apiConnector"
import { settingsEndpoints } from "./apis"
import { logout } from "@modules/auth/services/authAPI"
import type { AppDispatch } from "@shared/store/store"
import type { NavigateFunction, ApiError } from "@modules/auth/types"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

// API Response Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
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

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  updatedUserDetails?: UserData;
}



// ================ update User Profile Image  ================
export function updateUserProfileImage(token: string, formData: FormData | Record<string, unknown>) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...")

    try {
      const response = await apiConnector<ApiResponse<UserData>>(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData as unknown as Record<string, unknown>,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )


      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Could not update profile picture")
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data));

      // below line is must - if not code - then as we refresh the page after changing profile image then old profile image will show 
      // as we only changes in user(store) not in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error) {
      const apiError = error as ApiError;

      toast.error("Could Not Update Profile Picture")
    }
    toast.dismiss(toastId)
  }
}

// ================ update Profile  ================
export function updateProfile(
  token: string,
  formData: Record<string, unknown>,
  navigate?: (path: string) => void
) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Cargando...")
    try {
      const response = await apiConnector<UpdateProfileResponse>("PUT", UPDATE_PROFILE_API, formData as unknown as (Record<string, unknown> | FormData), {
        Authorization: `Bearer ${token}`,
      })


      if (!response.data.success || !response.data.updatedUserDetails) {
        throw new Error(response.data.message || "No se pudo actualizar el perfil");
      }
      const updatedUser = response.data.updatedUserDetails;
      const userImage = updatedUser.image
        ? updatedUser.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.firstName} ${updatedUser.lastName}`

      dispatch(setUser({ ...updatedUser, image: userImage }))

      localStorage.setItem("user", JSON.stringify({ ...updatedUser, image: userImage }));

      toast.success("Perfil actualizado");

      // Intentar redirección
      if (navigate) {
        navigate("/dashboard/my-profile");
      } else {
        // Fallback si no hay navigate
        window.location.href = "/dashboard/my-profile";
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil")
    }
    toast.dismiss(toastId)
  }
}


// ================ change Password  ================
export async function changePassword(token: string, formData: Record<string, unknown>) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector<ApiResponse>("POST", CHANGE_PASSWORD_API, formData as unknown as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    })


    if (!response.data.success) {
      throw new Error(response.data.message || "Could not change password")
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    const apiError = error as ApiError;

    toast.error(apiError.response?.data?.message || "Could Not Change Password")
  }
  toast.dismiss(toastId)
}

// ================ delete Profile ================
export function deleteProfile(token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector<ApiResponse>("DELETE", DELETE_PROFILE_API, undefined, {
        Authorization: `Bearer ${token}`,
      })


      if (!response.data.success) {
        throw new Error(response.data.message || "Could not delete profile")
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      const apiError = error as ApiError;

      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}