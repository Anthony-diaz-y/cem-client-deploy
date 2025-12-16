// Settings Module - Public API

// Types
export type { PasswordFormData, ProfileFormData, ApiError, NavigateFunction } from './types';

// Components
export { default as Settings } from './components/Settings';
export { default as ChangeProfilePicture } from './components/ChangeProfilePicture';
export { default as DeleteAccount } from './components/DeleteAccount';
export { default as EditProfile } from './components/EditProfile';
export { default as UpdatePassword } from './components/UpdatePassword';

// Services
export * from './services/SettingsAPI';

// Container (to be created)
// export { default as SettingsContainer } from './containers/SettingsContainer';
