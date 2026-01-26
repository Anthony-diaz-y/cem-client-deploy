import { Platform } from "@/types/scheduledClasses.types";
import {
  PLATAFORMAS,
  COLORES_PLATAFORMA,
  COLORES_PLATAFORMA_TEXTO,
  FORMATO_FECHA_COMPLETA,
  FORMATO_FECHA_CORTA,
  FORMATO_HORA
} from "@/modules/scheduled-classes/constants/scheduledClasses.constants";

// Formatear fecha ISO a texto legible en español
export const formatearFechaProgramada = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-ES', FORMATO_FECHA_COMPLETA);
};

// Formatear solo la fecha (sin hora)
export const formatearSoloFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-ES', FORMATO_FECHA_CORTA);
};

// Formatear solo la hora
export const formatearSoloHora = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-ES', FORMATO_HORA);
};

// Obtener icono de plataforma
export const obtenerIconoPlataforma = (plataforma: Platform): string => {
  const plat = PLATAFORMAS.find(p => p.value === plataforma);
  return plat?.icon || '🔗';
};

// Obtener color de fondo para plataforma
export const obtenerColorPlataforma = (plataforma: Platform): string => {
  return COLORES_PLATAFORMA[plataforma] || COLORES_PLATAFORMA['Otro'];
};

// Obtener color de texto para plataforma
export const obtenerColorTextoPlataforma = (plataforma: Platform): string => {
  return COLORES_PLATAFORMA_TEXTO[plataforma] || COLORES_PLATAFORMA_TEXTO['Otro'];
};

// Verificar si la fecha es futura
export const esFechaFutura = (fechaISO: string): boolean => {
  return new Date(fechaISO) > new Date();
};

// Verificar si la clase está en vivo ahora
export const estaEnVivo = (fechaISO: string, duracionMinutos: number): boolean => {
  const ahora = new Date();
  const inicio = new Date(fechaISO);
  const fin = new Date(inicio.getTime() + duracionMinutos * 60000);
  return ahora >= inicio && ahora <= fin;
};

// Verificar si la clase ya finalizó
export const yaFinalizo = (fechaISO: string, duracionMinutos: number): boolean => {
  const ahora = new Date();
  const fin = new Date(new Date(fechaISO).getTime() + duracionMinutos * 60000);
  return ahora > fin;
};

// Calcular tiempo restante hasta la clase
export const obtenerTiempoRestante = (fechaProgramada: string): string => {
  const ahora = new Date();
  const fechaClase = new Date(fechaProgramada);
  const diffMs = fechaClase.getTime() - ahora.getTime();

  if (diffMs < 0) return 'Clase finalizada';

  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffHoras / 24);

  if (diffDias > 0) return `En ${diffDias} día${diffDias > 1 ? 's' : ''}`;
  if (diffHoras > 0) return `En ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;

  const diffMinutos = Math.floor(diffMs / (1000 * 60));
  if (diffMinutos > 0) return `En ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;

  return 'Próximamente';
};

// Obtener estado de la clase
export const obtenerEstadoClase = (
  fechaProgramada: string,
  duracionMinutos: number
): { texto: string; color: string; pulso: boolean } => {
  if (estaEnVivo(fechaProgramada, duracionMinutos)) {
    return { texto: 'En Vivo', color: 'bg-green-500', pulso: true };
  }

  if (yaFinalizo(fechaProgramada, duracionMinutos)) {
    return { texto: 'Finalizada', color: 'bg-gray-500', pulso: false };
  }

  const ahora = new Date();
  const fechaClase = new Date(fechaProgramada);
  const diffHoras = (fechaClase.getTime() - ahora.getTime()) / (1000 * 60 * 60);

  if (diffHoras <= 24) {
    return { texto: 'Próximamente', color: 'bg-yellow-500', pulso: false };
  }

  return { texto: 'Programada', color: 'bg-blue-500', pulso: false };
};

// Convertir fecha local a ISO 8601
export const convertirAISO = (fecha: Date): string => {
  return fecha.toISOString();
};

// Obtener mes y año actual en formato YYYY-MM
export const obtenerMesActual = (): string => {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  return `${año}-${mes}`;
};

// Obtener nombre del mes en español
export const obtenerNombreMes = (mesAño: string): string => {
  const [año, mes] = mesAño.split('-');
  const fecha = new Date(parseInt(año), parseInt(mes) - 1, 1);
  return fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
};
