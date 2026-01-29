export const formatDurationForBadge = (seconds: number | undefined | null): string => {
  if (!seconds || seconds === 0) return "0 min";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${String(hours).padStart(2, "0")} hr`);
    if (minutes > 0) {
      parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
    }
  } else if (minutes > 0) {
    parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
  }
  
  return parts.length > 0 ? parts.join(" ") : "0 min";
};
