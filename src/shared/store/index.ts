import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../../modules/auth/store/authSlice"
import cartReducer from "../../modules/course/store/cartSlice"
import courseReducer from "../../modules/course/store/courseSlice"
import profileReducer from "../../modules/auth/store/profileSlice"
import viewCourseReducer from "../../modules/view-course/store/viewCourseSlice"

import sidebarSlice from "../../modules/dashboard/store/sidebarSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
  sidebar: sidebarSlice
})

export default rootReducer
