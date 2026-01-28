export type {
  SignupData,
  LoginFormData,
  User,
  AuthState,
  ProfileState,
  AdditionalDetails,
  ProtectedRouteProps,
  OpenRouteProps,
  NavigateFunction,
  ApiError,
} from "./types";

export { AUTH_TEXTS } from "./constants/auth.constants";
export { FORM_FIELD_WIDTH } from "./constants/form.constants";

export { useForgotPassword } from "./hooks/useForgotPassword";
export type { UseForgotPasswordReturn } from "./hooks/useForgotPassword";
export { useUpdatePassword } from "./hooks/useUpdatePassword";
export type { UseUpdatePasswordReturn } from "./hooks/useUpdatePassword";
export { useVerifyEmail } from "./hooks/useVerifyEmail";
export type { UseVerifyEmailReturn } from "./hooks/useVerifyEmail";

export { RegisterSection } from "./components/register";
export { default as OpenRoute } from "./components/OpenRoute";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as ProfileDropDown } from "./components/ProfileDropDown";
export { default as MobileProfileDropDown } from "./components/MobileProfileDropDown";
export { default as ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { default as UpdatePasswordForm } from "./components/UpdatePasswordForm";
export { default as VerifyEmailForm } from "./components/VerifyEmailForm";

export { default as LoginContainer } from "./containers/LoginContainer";
export { default as SignupContainer } from "./containers/SignupContainer";
export { default as ForgotPasswordContainer } from "./containers/ForgotPasswordContainer";
export { default as UpdatePasswordContainer } from "./containers/UpdatePasswordContainer";
export { default as VerifyEmailContainer } from "./containers/VerifyEmailContainer";

export * from "./services/authAPI";

export { default as authReducer } from "./store/authSlice";
export { default as profileReducer } from "./store/profileSlice";
