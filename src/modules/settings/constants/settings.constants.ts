// Settings Module - Constants
// Datos estáticos para componentes del módulo Settings

export const SETTINGS_TEXTS = {
  settings: {
    title: "Editar Perfil",
  },
  changeProfilePicture: {
    title: "Cambiar Foto de Perfil",
    buttons: {
      select: "Seleccionar",
      upload: "Subir",
      uploading: "Subiendo...",
    },
  },
  editProfile: {
    title: "Información del Perfil",
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      dateOfBirth: "Fecha de Nacimiento",
      gender: "Género",
      contactNumber: "Número de Teléfono",
      about: "Acerca de mí",
    },
    placeholders: {
      firstName: "Ingresa tu nombre",
      lastName: "Ingresa tu apellido",
      contactNumber: "Ingresa tu número de teléfono",
      about: "Cuéntanos algo sobre ti...",
    },
    validation: {
      firstNameRequired: "Por favor, ingresa tu nombre.",
      lastNameRequired: "Por favor, ingresa tu apellido.",
      dateOfBirthRequired: "Por favor, ingresa tu fecha de nacimiento.",
      dateOfBirthFuture: "La fecha de nacimiento no puede ser futura.",
      genderRequired: "Por favor, selecciona tu género.",
      contactNumberRequired: "Por favor, ingresa tu número de teléfono.",
      contactNumberInvalid: "Número de teléfono inválido",
      aboutRequired: "Por favor, escribe algo sobre ti.",
    },
    genders: ["Masculino", "Femenino", "No Binario", "Prefiero no decirlo", "Otro"],
    buttons: {
      cancel: "Cancelar",
      save: "Guardar",
    },
    links: {
      myProfile: "/dashboard/my-profile",
    },
  },
  updatePassword: {
    title: "Contraseña",
    fields: {
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmNewPassword: "Confirmar Nueva Contraseña",
    },
    placeholders: {
      currentPassword: "Ingresa tu contraseña actual",
      newPassword: "Ingresa tu nueva contraseña",
      confirmNewPassword: "Confirma tu nueva contraseña",
    },
    validation: {
      currentPasswordRequired: "Por favor, ingresa tu contraseña actual.",
      newPasswordRequired: "Por favor, ingresa tu nueva contraseña.",
      confirmNewPasswordRequired: "Por favor, confírma tu nueva contraseña.",
    },
    buttons: {
      cancel: "Cancelar",
      update: "Actualizar",
    },
    links: {
      myProfile: "/dashboard/my-profile",
    },
  },
  deleteAccount: {
    title: "Eliminar Cuenta",
    message: "¿Te gustaría eliminar tu cuenta?",
    warning: "Esta cuenta puede contener cursos pagados. Eliminar tu cuenta es permanente y borrará todo el contenido asociado a ella.",
    checkboxLabel: "Deseo eliminar mi cuenta.",
    modal: {
      title: "¿Estás seguro?",
      message: "¡Eliminar mi cuenta!",
      confirm: "Eliminar",
      cancel: "Cancelar",
    },
  },
  api: {
    loading: "Cargando...",
    errors: {
      updateProfilePicture: "No se pudo actualizar la foto de perfil",
      updateProfile: "No se pudo actualizar el perfil",
      changePassword: "Algo salió mal",
      deleteProfile: "No se pudo eliminar el perfil",
      defaultUpdateProfilePicture: "No se pudo actualizar la foto de perfil",
      defaultUpdateProfile: "No se pudo actualizar el perfil",
      defaultChangePassword: "No se pudo cambiar la contraseña",
      defaultDeleteProfile: "No se pudo eliminar el perfil",
    },
    success: {
      updateProfilePicture: "Foto de perfil actualizada exitosamente",
      updateProfile: "Perfil actualizado exitosamente",
      changePassword: "Contraseña cambiada exitosamente",
      deleteProfile: "Perfil eliminado exitosamente",
    },
  },
} as const;

