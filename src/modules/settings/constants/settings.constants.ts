// Settings Module - Constants
// Datos estáticos para componentes del módulo Settings

export const SETTINGS_TEXTS = {
  settings: {
    title: "Edit Profile",
  },
  changeProfilePicture: {
    title: "Change Profile Picture",
    buttons: {
      select: "Select",
      upload: "Upload",
      uploading: "Uploading...",
    },
  },
  editProfile: {
    title: "Profile Information",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      contactNumber: "Contact Number",
      about: "About",
    },
    placeholders: {
      firstName: "Enter first name",
      lastName: "Enter first name",
      contactNumber: "Enter Contact Number",
      about: "Enter Bio Details",
    },
    validation: {
      firstNameRequired: "Please enter your first name.",
      lastNameRequired: "Please enter your last name.",
      dateOfBirthRequired: "Please enter your Date of Birth.",
      dateOfBirthFuture: "Date of Birth cannot be in the future.",
      genderRequired: "Please enter your Date of Birth.",
      contactNumberRequired: "Please enter your Contact Number.",
      contactNumberInvalid: "Invalid Contact Number",
      aboutRequired: "Please enter your About.",
    },
    genders: ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"],
    buttons: {
      cancel: "Cancel",
      save: "Save",
    },
    links: {
      myProfile: "/dashboard/my-profile",
    },
  },
  updatePassword: {
    title: "Password",
    fields: {
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
    },
    placeholders: {
      currentPassword: "Enter Current Password",
      newPassword: "Enter New Password",
      confirmNewPassword: "Enter Confirm New Password",
    },
    validation: {
      currentPasswordRequired: "Please enter your Current Password.",
      newPasswordRequired: "Please enter your New Password.",
      confirmNewPasswordRequired: "Please enter your Confirm New Password.",
    },
    buttons: {
      cancel: "Cancel",
      update: "Update",
    },
    links: {
      myProfile: "/dashboard/my-profile",
    },
  },
  deleteAccount: {
    title: "Delete Account",
    message: "Would you like to delete account ?",
    warning: "This account may contain Paid Courses. Deleting your account is permanent and will remove all the contain associated with it.",
    checkboxLabel: "I want to delete my account.",
    modal: {
      title: "Are you sure ?",
      message: "Delete my account...!",
      confirm: "Delete",
      cancel: "Cancel",
    },
  },
  api: {
    loading: "Loading...",
    errors: {
      updateProfilePicture: "Could Not Update Profile Picture",
      updateProfile: "Could Not Update Profile",
      changePassword: "Something went wrong",
      deleteProfile: "Could Not Delete Profile",
      defaultUpdateProfilePicture: "Could not update profile picture",
      defaultUpdateProfile: "Could not update profile",
      defaultChangePassword: "Could not change password",
      defaultDeleteProfile: "Could not delete profile",
    },
    success: {
      updateProfilePicture: "Display Picture Updated Successfully",
      updateProfile: "Profile Updated Successfully",
      changePassword: "Password Changed Successfully",
      deleteProfile: "Profile Deleted Successfully",
    },
  },
} as const;

