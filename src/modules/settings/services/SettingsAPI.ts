import { toast } from "react-hot-toast";

import { setUser } from "@modules/auth/store/profileSlice";
import { apiConnector } from "@shared/services/apiConnector";
import { settingsEndpoints } from "@shared/services/apis";
import { logout } from "@modules/auth/services/authAPI";
import { AppDispatch } from "@shared/store/store";
import { ApiError, NavigateFunction } from "@modules/auth/types";
import { ProfileFormData, PasswordFormData } from "../types";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

// ================ update User Profile Image  ================
export function updateUserProfileImage(token: string, formData: FormData) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");

    try {
      const response = await apiConnector(
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Display Picture Updated Successfully");
      dispatch(setUser(response.data.data));

      // below line is must - if not code - then as we refresh the page after changing profile image then old profile image will show
      // as we only changes in user(store) not in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error) {
      const apiError = error as ApiError;
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || "Could Not Update Profile Picture"
      );
    }
    toast.dismiss(toastId);
  };
}

// ================ update Profile  ================
export function updateProfile(token: string, formData: ProfileFormData) {
  return async (dispatch: AppDispatch) => {
    // console.log('This is formData for updated profile -> ', formData)
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData as unknown as (Record<string, unknown> | FormData), {
        Authorization: `Bearer ${token} `,
      });
      console.log("UPDATE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data?.updatedUserDetails?.image
        ? response.data.updatedUserDetails?.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`;

      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      );

      // console.log('DATA = ', data)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.data.updatedUserDetails,
          image: userImage,
        })
      );
      toast.success("Profile Updated Successfully");
    } catch (error) {
      const apiError = error as ApiError;
      console.log("UPDATE_PROFILE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || "Could Not Update Profile"
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
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData as unknown as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Changed Successfully");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CHANGE_PASSWORD_API API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Something went wrong");
  }
  toast.dismiss(toastId);
}

// ================ delete Profile ================
export function deleteProfile(token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, undefined, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      const apiError = error as ApiError;
      console.log("DELETE_PROFILE_API API ERROR............", apiError);
      toast.error(
        apiError.response?.data?.message || "Could Not Delete Profile"
      );
    }
    toast.dismiss(toastId);
  };
}
