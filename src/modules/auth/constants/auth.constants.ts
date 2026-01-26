// Auth Module - Constants
// Datos estáticos para componentes del módulo Auth

export const AUTH_TEXTS = {
  login: {
    title: "Welcome Back",
    description1: "Build skills for today, tomorrow, and beyond.",
    description2: "Education to future-proof your career.",
  },
  signup: {
    title: "Join the millions learning to code with StudyNotion for free",
    description1: "Build skills for today, tomorrow, and beyond.",
    description2: "Education to future-proof your career.",
  },
  forgotPassword: {
    title: {
      default: "Reset your password",
      emailSent: "Check email",
    },
    description: {
      default: "Te enviaremos un email con instrucciones para restablecer tu contraseña.",
      warning: "⚠️ El link expira en 5 minutos. Por favor, revisa tu correo (y la carpeta de spam) después de enviar.",
      emailSent: "Hemos enviado el email de reset a",
      emailSentInstruction: "Por favor, revisa tu correo y haz clic en el link para restablecer tu contraseña. Si no lo encuentras, revisa la carpeta de spam.",
    },
    button: {
      submit: "Sumbit",
      resend: "Resend Email",
    },
  },
  updatePassword: {
    title: "Choose new password",
    description: "Almost done. Enter your new password and you're all set.",
    invalidToken: {
      title: "Token inválido",
      message: "El link de reset de contraseña no es válido. Por favor, solicita un nuevo link.",
      button: "Solicitar nuevo link",
    },
  },
  verifyEmail: {
    title: "Verify Email",
    description: "A verification code has been sent to you. Enter the code below",
  },
} as const;


