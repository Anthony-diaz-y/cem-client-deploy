// Profile Module - Constants
// Datos estáticos para componentes del módulo Profile

export const PROFILE_TEXTS = {
  myProfile: {
    title: "My Profile",
    edit: "Edit",
    sections: {
      about: "About",
      personalDetails: "Personal Details",
    },
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      accountType: "Account Type",
      email: "Email",
      gender: "Gender",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date Of Birth",
    },
    placeholders: {
      about: "Write Something About Yourself",
      gender: "Add Gender",
      contactNumber: "Add Contact Number",
      dateOfBirth: "Add Date Of Birth",
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


