import { toast } from "react-hot-toast";
import { NavigateFunction } from "@modules/auth/types";

import { setLoading, setUser } from "@modules/auth/store/profileSlice";
import { apiConnector } from "@shared/services/apiConnector";
import { profileEndpoints } from "@shared/services/apis";
import { logout } from "@modules/auth/services/authAPI";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

import { AppDispatch } from "@shared/store/store";

// ================ get User Details  ================
export function getUserDetails(token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, undefined, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_USER_DETAILS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
      dispatch(setUser({ ...response.data.data, image: userImage }));
    } catch (error) {
      dispatch(logout(navigate));
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error("Could Not Get User Details");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// ================ get User Enrolled Courses  ================
export async function getUserEnrolledCourses(token: string) {
  // const toastId = toast.loading("Loading...")
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      { token },
      { Authorization: `Bearer ${token}` }
    );

    console.log(
      "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      response
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  // toast.dismiss(toastId)
  return result;
}

// ================ get Instructor Data  ================
export async function getInstructorData(token: string) {
  // const toastId = toast.loading("Loading...")
  let result = [];
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, undefined, {
      Authorization: `Bearer ${token}`,
    });
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response);
    if (response?.data?.courses) {
      result = response?.data?.courses;
    }
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error);
    toast.error("Could Not Get Instructor Data");
  }
  // toast.dismiss(toastId)
  return result;
}
