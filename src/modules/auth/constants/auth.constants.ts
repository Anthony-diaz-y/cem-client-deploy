// Auth Module - Constants
// Datos estáticos para componentes del módulo Auth

export const AUTH_TEXTS = {
  login: {
    title: "Bienvenido de nuevo",
    description1: "Desarrolla habilidades para hoy, mañana y siempre.",
    description2: "Educación para asegurar tu carrera en el futuro.",
  },
  signup: {
    title:
      "Únete a los millones que están aprendiendo con CEM de forma gratuita",
    description1: "Desarrolla habilidades para hoy, mañana y siempre.",
    description2: "Educación para asegurar tu carrera en el futuro.",
  },
  forgotPassword: {
    title: {
      default: "Restablecer contraseña",
      emailSent: "Revisa tu correo",
    },
    description: {
      default:
        "Te enviaremos un email con instrucciones para restablecer tu contraseña.",
      warning:
        "⚠️ El link expira en 5 minutos. Por favor, revisa tu correo (y la carpeta de spam) después de enviar.",
      emailSent: "Hemos enviado el email de restablecimiento a",
      emailSentInstruction:
        "Por favor, revisa tu correo y haz clic en el link para restablecer tu contraseña. Si no lo encuentras, revisa la carpeta de spam.",
    },
    button: {
      submit: "Enviar",
      resend: "Reenviar correo",
    },
    fields: {
      email: {
        label: "Correo electrónico",
        placeholder: "Ingresa tu correo electrónico",
      },
    },
    links: {
      backToLogin: "Volver al inicio de sesión",
    },
  },
  updatePassword: {
    title: "Elige una nueva contraseña",
    description: "Casi listo. Ingresa tu nueva contraseña y estarás listo.",
    invalidToken: {
      title: "Token inválido",
      message:
        "El link de reset de contraseña no es válido. Por favor, solicita un nuevo link.",
      button: "Solicitar nuevo link",
    },
  },
  verifyEmail: {
    title: "Verificar correo",
    description:
      "Se te ha enviado un código de verificación. Ingresa el código a continuación.",
  },
} as const;
