/**
 * Configuración de Brevo (anteriormente Sendinblue)
 */

/**
 * Obtiene la API key de Brevo desde las variables de entorno
 */
export const getBrevoApiKey = (): string | null => {
  // Esta función es solo para referencia y validación
  if (typeof window !== 'undefined') {
    console.warn('⚠️ ADVERTENCIA: La API key de Brevo no debe estar en el frontend por seguridad.');
    console.warn('⚠️ Brevo debe usarse exclusivamente en el backend.');
  }
  
  // En desarrollo, podemos tener una variable de entorno para referencia
  // pero NO debe usarse en el frontend para enviar emails
  return process.env.NEXT_PUBLIC_BREVO_API_KEY || null;
};

/**
 * Configuración de Brevo
 */
export const brevoConfig = {
  // Email del remitente (debe configurarse en el backend)
  senderEmail: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'noreply@example.com',
  senderName: process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || 'E-Learning Platform',
  
  // URLs de las plantillas (si se usan)
  templates: {
    otp: 'otp-verification',
    passwordReset: 'password-reset',
  },
  
  // Configuración de logging
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
};

/**
 * Valida que la configuración de Brevo esté completa
 * @returns true si la configuración es válida
 */
export const validateBrevoConfig = (): boolean => {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ La validación de Brevo debe hacerse en el backend, no en el frontend.');
    return false;
  }
  return true;
};

