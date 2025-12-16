// Settings Module Types

// Re-export types from auth module
export type { ApiError, NavigateFunction } from "../../auth/types";

export interface PasswordFormData {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  about: string;
};
