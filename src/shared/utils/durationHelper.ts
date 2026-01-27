/**
 * Formatea duración en segundos a formato legible (ej: "2h 30m", "45m 30s")
 */
export const formatTotalDuration = (seconds: number | undefined | null): string => {
  if (!seconds || seconds === 0) return "N/A";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  } else {
    return `${secs}s`;
  }
};

