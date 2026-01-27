import type { ReactNode } from "react";

export interface SignupData {
  accountType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AdditionalDetails {
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  about?: string;
  [key: string]: unknown;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "Student" | "Instructor";
  image?: string;
  additionalDetails?: AdditionalDetails;
}

export interface AuthState {
  signupData: SignupData | null;
  loading: boolean;
  token: string | null;
}

export interface ProfileState {
  user: User | null;
  loading: boolean;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface OpenRouteProps {
  children: ReactNode;
}

export type NavigateFunction = (url: string) => void;

export interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      message?: string;
      errors?: Array<{
        constraints?: Record<string, string>;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    };
  };
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SendOtpResponse extends ApiResponse {
  success: boolean;
  message: string;
}

export interface SignupResponse extends ApiResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ResetPasswordTokenResponse extends ApiResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse extends ApiResponse {
  success: boolean;
  message: string;
}