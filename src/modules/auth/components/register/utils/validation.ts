export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const PASSWORD_ERROR_MESSAGE = "La contraseña debe tener mínimo 6 caracteres";
export const EMAIL_ERROR_MESSAGE = "Por favor ingresa un correo electrónico válido";
