/**
 * Helper function to format course duration
 * Handles different formats from backend and converts to readable format
 */

/**
 * Formats total duration from backend to readable format (e.g., "2h 30m" or "45m 30s")
 * @param duration - Duration string or number from backend (could be in seconds, minutes, or already formatted)
 * @returns Formatted duration string (e.g., "2h 30m" or "45m 30s")
 */
export const formatTotalDuration = (duration: string | number | undefined | null): string => {
  if (!duration) return "N/A";
  
  // Si ya está formateado como "Xh Ym" o "Xm Ys", verificar si es válido
  if (typeof duration === "string") {
    // Verificar si ya está en formato legible (contiene "h", "m", o "s")
    if (duration.includes("h") || duration.includes("m") || duration.includes("s")) {
      // Verificar si el formato parece correcto
      const parts = duration.match(/(\d+)h|(\d+)m|(\d+)s/g);
      if (parts && parts.length > 0) {
        // Extraer horas, minutos y segundos
        const hoursMatch = duration.match(/(\d+)h/);
        const minutesMatch = duration.match(/(\d+)m/);
        const secondsMatch = duration.match(/(\d+)s/);
        
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
        
        // Calcular total en segundos para validar
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        // Si hay más de 24 horas, probablemente es un error de conversión
        // O si las horas son muy grandes pero los minutos son pequeños, podría ser un error
        // Caso común: "49h 33m" donde 49 son minutos y 33 son segundos
        if (hours > 24 || (hours > 0 && hours > 10 && minutes < 60)) {
          // Si las horas son razonables como minutos (menos de 60), probablemente son minutos
          if (hours < 60) {
            // Las "horas" son en realidad minutos, y los "minutos" son en realidad segundos
            const totalMinutes = hours;
            const totalSecondsFromMinutes = minutes;
            if (totalSecondsFromMinutes > 0) {
              return formatDurationFromSeconds(totalMinutes * 60 + totalSecondsFromMinutes);
            }
            return formatDurationFromMinutes(totalMinutes);
          } else {
            // Si las horas son muy grandes, intentar recalcular
            // Asumir que las horas son minutos mal interpretados
            const totalMinutes = hours;
            if (minutes > 0 && minutes < 60) {
              // Los minutos podrían ser segundos
              return formatDurationFromSeconds(totalMinutes * 60 + minutes);
            }
            return formatDurationFromMinutes(totalMinutes);
          }
        }
        
        // Si el formato parece correcto y razonable, devolverlo
        return duration;
      }
    }
    
    // Si es un string numérico, intentar parsearlo
    const parsed = parseFloat(duration);
    if (!isNaN(parsed)) {
      // Si el número es muy grande (probablemente está en segundos o mal calculado)
      if (parsed > 86400) { // Más de 24 horas en segundos
        // Probablemente está en segundos pero mal calculado, recalcular
        return formatDurationFromSeconds(Math.round(parsed));
      } else if (parsed > 1440) { // Más de 24 horas en minutos
        // Probablemente está en minutos pero mal calculado
        return formatDurationFromMinutes(Math.round(parsed));
      } else if (parsed > 60) {
        // Probablemente está en minutos
        return formatDurationFromMinutes(Math.round(parsed));
      } else {
        // Probablemente está en horas (poco probable pero posible)
        return formatDurationFromHours(parsed);
      }
    }
  }
  
  // Si es un número
  if (typeof duration === "number") {
    // Si el número es muy grande, probablemente está en segundos
    if (duration > 86400) {
      return formatDurationFromSeconds(Math.round(duration));
    } else if (duration > 1440) {
      // Probablemente está en minutos pero mal calculado
      return formatDurationFromMinutes(Math.round(duration));
    } else if (duration > 60) {
      // Probablemente está en minutos
      return formatDurationFromMinutes(Math.round(duration));
    } else {
      // Probablemente está en horas
      return formatDurationFromHours(duration);
    }
  }
  
  return "N/A";
};

/**
 * Formats duration from total seconds
 */
const formatDurationFromSeconds = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (seconds > 0) {
      return `${hours}h ${seconds}s`;
    }
    return `${hours}h`;
  } else if (minutes > 0) {
    if (seconds > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Formats duration from total minutes
 */
const formatDurationFromMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Formats duration from total hours
 */
const formatDurationFromHours = (totalHours: number): string => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

