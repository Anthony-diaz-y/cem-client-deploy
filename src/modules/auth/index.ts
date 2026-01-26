// Auth Module - Public API
// Scream Modular Architecture: Feature-based organization

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

// Constants
export { AUTH_TEXTS } from "./constants/auth.constants";

// Hooks
export { useForgotPassword } from "./hooks/useForgotPassword";
export type { UseForgotPasswordReturn } from "./hooks/useForgotPassword";
export { useUpdatePassword } from "./hooks/useUpdatePassword";
export type { UseUpdatePasswordReturn } from "./hooks/useUpdatePassword";
export { useVerifyEmail } from "./hooks/useVerifyEmail";
export type { UseVerifyEmailReturn } from "./hooks/useVerifyEmail";

// Components
export { default as LoginForm } from "./components/LoginForm";
export { default as SignupForm } from "./components/SignupForm";
export { default as Template } from "./components/Template";
export { default as OpenRoute } from "./components/OpenRoute";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as ProfileDropDown } from "./components/ProfileDropDown";
export { default as MobileProfileDropDown } from "./components/MobileProfileDropDown";
export { default as ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { default as UpdatePasswordForm } from "./components/UpdatePasswordForm";
export { default as VerifyEmailForm } from "./components/VerifyEmailForm";

// Containers
export { default as LoginContainer } from "./containers/LoginContainer";
export { default as SignupContainer } from "./containers/SignupContainer";
export { default as ForgotPasswordContainer } from "./containers/ForgotPasswordContainer";
export { default as UpdatePasswordContainer } from "./containers/UpdatePasswordContainer";
export { default as VerifyEmailContainer } from "./containers/VerifyEmailContainer";

// Services
export * from "./services/authAPI";

// Store
export { default as authReducer } from "./store/authSlice";
export { default as profileReducer } from "./store/profileSlice";
