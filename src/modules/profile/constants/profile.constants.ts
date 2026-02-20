// Profile Module - Constants
// Datos estáticos para componentes del módulo Profile

export const PROFILE_TEXTS = {
  myProfile: {
    title: "Mi Perfil",
    edit: "Editar",
    sections: {
      about: "Acerca de mí",
      personalDetails: "Detalles Personales",
    },
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      accountType: "Tipo de Cuenta",
      email: "Correo Electrónico",
      gender: "Género",
      phoneNumber: "Número de Teléfono",
      dateOfBirth: "Fecha de Nacimiento",
    },
    placeholders: {
      about: "Escribe algo sobre ti...",
      gender: "Agregar género",
      contactNumber: "Agregar número de contacto",
      dateOfBirth: "Agregar fecha de nacimiento",
    },
  },
  api: {
    loading: "Loading...",
    errors: {
      getUserDetails: "No se pudieron obtener los detalles del usuario",
      getEnrolledCourses: "No se pudieron obtener los cursos inscritos",
      getInstructorData: "No se pudo obtener los datos del instructor",
      default: "Could not get user details",
      defaultEnrolled: "Could not get enrolled courses",
    },
  },
  links: {
    settings: "/dashboard/settings",
  },
} as const;


