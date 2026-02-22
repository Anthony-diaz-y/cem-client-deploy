// Contact Module - Constants
// Datos estáticos para componentes del módulo Contact

export const CONTACT_TEXTS = {
  form: {
    title: "¿Tienes una idea? Tenemos las habilidades. Trabajemos juntos",
    description: "Cuéntanos más sobre ti y lo que tienes en mente.",
    fields: {
      firstname: {
        label: "Nombres",
        placeholder: "Ingresa tus nombres",
        error: "Por favor ingresa tus nombres.",
      },
      lastname: {
        label: "Apellidos",
        placeholder: "Ingresa tus apellidos",
      },
      email: {
        label: "Correo Electrónico",
        placeholder: "Ingresa tu correo electrónico",
        error: "Por favor ingresa un correo válido.",
        required: true,
      },
      subject: {
        label: "Asunto (Opcional)",
        placeholder: "Ingresa el asunto",
      },
      phone: {
        label: "Número de Teléfono (Opcional)",
        placeholder: "123 456 789",
      },
      message: {
        label: "Mensaje",
        placeholder: "Escribe tu mensaje aquí",
        error: "Por favor escribe tu mensaje.",
        required: true,
      },
    },
    button: {
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
    },
    success: {
      message:
        "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.",
    },
    countryCode: {
      placeholder: "Buscar código o país...",
      noResults: "No se encontraron resultados",
      default: "+51",
    },
  },
  reviews: {
    title: "Lo que dicen nuestros estudiantes",
  },
} as const;
