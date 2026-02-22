export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasUppercase && hasLowercase && hasNumber;
};

export const getPasswordValidations = (password: string) => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
  };
};

export const isValidOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const PASSWORD_ERROR_MESSAGE =
  "La contraseña no cumple con todos los requisitos de seguridad";
export const EMAIL_ERROR_MESSAGE =
  "Por favor ingresa un correo electrónico válido";
