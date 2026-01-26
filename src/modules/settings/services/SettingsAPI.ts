import { toast } from "react-hot-toast";

import { setUser } from "@modules/auth/store/profileSlice";
import { apiConnector } from "@shared/services/apiConnector";
import { settingsEndpoints } from "@shared/services/apis";
import { logout } from "@modules/auth/services/authAPI";
import { AppDispatch } from "@shared/store/store";
import { ApiError, NavigateFunction } from "@modules/auth/types";
import { ProfileFormData, PasswordFormData } from "../types";
import { SETTINGS_TEXTS } from "../constants/settings.constants";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

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
export function updateUserProfileImage(token: string, formData: FormData) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading(SETTINGS_TEXTS.api.loading);

    try {
      const response = await apiConnector<ApiResponse<UserData>>(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData as unknown as (Record<string, unknown> | FormData),
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token} `,
        }
      );
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || SETTINGS_TEXTS.api.errors.defaultUpdateProfilePicture);
      }
      toast.success(SETTINGS_TEXTS.api.success.updateProfilePicture);
      dispatch(setUser(response.data.data));

      // below line is must - if not code - then as we refresh the page after changing profile image then old profile image will show
      // as we only changes in user(store) not in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error) {
      const apiError = error as ApiError;
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || SETTINGS_TEXTS.api.errors.updateProfilePicture
      );
    }
    toast.dismiss(toastId);
  };
}

// ================ update Profile  ================
export function updateProfile(token: string, formData: ProfileFormData) {
  return async (dispatch: AppDispatch) => {
    // console.log('This is formData for updated profile -> ', formData)
    const toastId = toast.loading(SETTINGS_TEXTS.api.loading);
    try {
      const response = await apiConnector<UpdateProfileResponse>("PUT", UPDATE_PROFILE_API, formData as unknown as (Record<string, unknown> | FormData), {
        Authorization: `Bearer ${token} `,
      });
      console.log("UPDATE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success || !response.data.updatedUserDetails) {
        throw new Error(response.data.message || SETTINGS_TEXTS.api.errors.defaultUpdateProfile);
      }
      const updatedUser = response.data.updatedUserDetails;
      const userImage = updatedUser.image
        ? updatedUser.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.firstName} ${updatedUser.lastName}`;

      dispatch(
        setUser({ ...updatedUser, image: userImage })
      );

      // console.log('DATA = ', data)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...updatedUser,
          image: userImage,
        })
      );
      toast.success(SETTINGS_TEXTS.api.success.updateProfile);
    } catch (error) {
      const apiError = error as ApiError;
      console.log("UPDATE_PROFILE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || SETTINGS_TEXTS.api.errors.updateProfile
      );
    }
    toast.dismiss(toastId);
  };
}

// ================ change Password  ================
export async function changePassword(
  token: string,
  formData: PasswordFormData
) {
  const toastId = toast.loading(SETTINGS_TEXTS.api.loading);
  try {
    const response = await apiConnector<ApiResponse>("POST", CHANGE_PASSWORD_API, formData as unknown as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message || SETTINGS_TEXTS.api.errors.defaultChangePassword);
    }
    toast.success(SETTINGS_TEXTS.api.success.changePassword);
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CHANGE_PASSWORD_API API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || SETTINGS_TEXTS.api.errors.changePassword);
  }
  toast.dismiss(toastId);
}

// ================ delete Profile ================
export function deleteProfile(token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading(SETTINGS_TEXTS.api.loading);
    try {
      const response = await apiConnector<ApiResponse>("DELETE", DELETE_PROFILE_API, undefined, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message || SETTINGS_TEXTS.api.errors.defaultDeleteProfile);
      }
      toast.success(SETTINGS_TEXTS.api.success.deleteProfile);
      dispatch(logout(navigate));
    } catch (error) {
      const apiError = error as ApiError;
      console.log("DELETE_PROFILE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || SETTINGS_TEXTS.api.errors.deleteProfile
      );
    }
    toast.dismiss(toastId);
  };
}
