// Auth Module - Public API

// Types
export type {
  SignupData,
  LoginFormData,
  User,
  AuthState,
  ProfileState,
  AdditionalDetails,
  TemplateProps,
  ProtectedRouteProps,
  OpenRouteProps,
  NavigateFunction,
  ApiError,
} from "./types";

// Components
export { default as LoginForm } from "./components/LoginForm";
export { default as SignupForm } from "./components/SignupForm";
export { default as Template } from "./components/Template";
export { default as OpenRoute } from "./components/OpenRoute";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as ProfileDropDown } from "./components/ProfileDropDown";
export { default as MobileProfileDropDown } from "./components/MobileProfileDropDown";

// Containers
export { default as LoginContainer } from "./containers/LoginContainer";
export { default as SignupContainer } from "./containers/SignupContainer";
export { default as ForgotPasswordContainer } from "./containers/ForgotPasswordContainer";
export { default as UpdatePasswordContainer } from "./containers/UpdatePasswordContainer";
export { default as VerifyEmailContainer } from "./containers/VerifyEmailContainer";

// Page Components (for backward compatibility)
export { default as ForgotPassword } from "./containers/ForgotPassword";
export { default as UpdatePassword } from "./containers/UpdatePassword";
export { default as VerifyEmail } from "./containers/VerifyEmail";

// Services
export * from "./services/authAPI";

// Store
export { default as authReducer } from "./store/authSlice";
export { default as profileReducer } from "./store/profileSlice";
