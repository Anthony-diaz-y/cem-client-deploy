/**
 * Servicio de Email - Preparado para Brevo
 * 
 * NOTA IMPORTANTE: Este servicio está preparado para trabajar con Brevo,
 * pero la lógica real de envío de emails debe implementarse en el BACKEND.
 * 
 * El frontend solo hace peticiones HTTP al backend, que es quien realmente
 * envía los emails usando Brevo.
 */

import { brevoConfig } from './brevoConfig';

/**
 * Tipos para el servicio de email
 */
export interface EmailOptions {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, string | number>;
}

export interface OtpEmailOptions {
  email: string;
  otp: string;
  firstName?: string;
  lastName?: string;
}

export interface PasswordResetEmailOptions {
  email: string;
  resetLink: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Genera el contenido HTML para el email de OTP
 */
export const generateOtpEmailContent = (options: OtpEmailOptions): string => {
  const { otp, firstName, lastName } = options;
  const userName = firstName && lastName ? `${firstName} ${lastName}` : 'Usuario';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificación</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Código de Verificación</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hola ${userName},</p>
          <p style="font-size: 16px;">Tu código de verificación es:</p>
          <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #666;">Este código expirará en 10 minutos.</p>
          <p style="font-size: 14px; color: #666;">Si no solicitaste este código, puedes ignorar este email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Este es un email automático, por favor no respondas.</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Genera el contenido HTML para el email de reset de contraseña
 */
export const generatePasswordResetEmailContent = (options: PasswordResetEmailOptions): string => {
  const { resetLink, firstName, lastName } = options;
  const userName = firstName && lastName ? `${firstName} ${lastName}` : 'Usuario';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Restablecer Contraseña</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hola ${userName},</p>
          <p style="font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón siguiente para continuar:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Restablecer Contraseña</a>
          </div>
          <p style="font-size: 14px; color: #666;">O copia y pega este enlace en tu navegador:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${resetLink}</p>
          <p style="font-size: 14px; color: #666;">Este enlace expirará en 5 minutos.</p>
          <p style="font-size: 14px; color: #666;">Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Este es un email automático, por favor no respondas.</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Prepara los datos del email para enviar al backend
 * El backend será quien realmente envíe el email usando Brevo
 */
export const prepareEmailData = (options: EmailOptions) => {
  return {
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
    textContent: options.textContent,
    templateId: options.templateId,
    params: options.params,
    sender: {
      email: brevoConfig.senderEmail,
      name: brevoConfig.senderName,
    },
  };
};

/**
 * Prepara los datos del email OTP para enviar al backend
 */
export const prepareOtpEmailData = (options: OtpEmailOptions) => {
  const htmlContent = generateOtpEmailContent(options);
  
  return prepareEmailData({
    to: options.email,
    subject: 'Código de Verificación - E-Learning Platform',
    htmlContent,
    textContent: `Tu código de verificación es: ${options.otp}. Este código expirará en 10 minutos.`,
  });
};

/**
 * Prepara los datos del email de reset de contraseña para enviar al backend
 */
export const preparePasswordResetEmailData = (options: PasswordResetEmailOptions) => {
  const htmlContent = generatePasswordResetEmailContent(options);
  
  return prepareEmailData({
    to: options.email,
    subject: 'Restablecer Contraseña - E-Learning Platform',
    htmlContent,
    textContent: `Haz clic en este enlace para restablecer tu contraseña: ${options.resetLink}. Este enlace expirará en 5 minutos.`,
  });
};

