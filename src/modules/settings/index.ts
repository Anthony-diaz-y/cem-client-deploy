// Settings Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  PasswordFormData,
  ProfileFormData,
  ApiError,
  NavigateFunction,
} from "./types";

// Constants
export { SETTINGS_TEXTS } from "./constants/settings.constants";

// Services
export * from "./services/SettingsAPI";

// Components
export { default as Settings } from "./components/Settings";
export { default as ChangeProfilePicture } from "./components/ChangeProfilePicture";
export { default as DeleteAccount } from "./components/DeleteAccount";
export { default as EditProfile } from "./components/EditProfile";
export { default as UpdatePassword } from "./components/UpdatePassword";
