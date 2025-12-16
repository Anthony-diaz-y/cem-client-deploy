// Auth Module Types

import type { StaticImageData } from "next/image";
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

// Component Props Types
export interface TemplateProps {
  title: string;
  description1: string;
  description2: string;
  image: string | StaticImageData;
  formType: "login" | "signup";
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface OpenRouteProps {
  children: ReactNode;
}

// Service Types
export type NavigateFunction = (url: string) => void;

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
