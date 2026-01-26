// Contact Module - Constants
// Datos estáticos para componentes del módulo Contact

export const CONTACT_TEXTS = {
  form: {
    title: "Got a Idea? We've got the skills. Let's team up",
    description: "Tell us more about yourself and what you're got in mind.",
    fields: {
      firstname: {
        label: "First Name",
        placeholder: "Enter first name",
        error: "Please enter your name.",
      },
      lastname: {
        label: "Last Name",
        placeholder: "Enter last name",
      },
      email: {
        label: "Email Address",
        placeholder: "Enter email address",
        error: "Please enter your Email address.",
        required: true,
      },
      subject: {
        label: "Subject (Optional)",
        placeholder: "Enter subject",
      },
      phone: {
        label: "Phone Number (Optional)",
        placeholder: "12345 67890",
      },
      message: {
        label: "Message",
        placeholder: "Enter your message here",
        error: "Please enter your Message.",
        required: true,
      },
    },
    button: {
      submit: "Send Message",
      submitting: "Enviando...",
    },
    success: {
      message: "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.",
    },
    countryCode: {
      placeholder: "Buscar código o país...",
      noResults: "No se encontraron resultados",
      default: "+51",
    },
  },
  reviews: {
    title: "Reviews from other learners",
  },
} as const;


