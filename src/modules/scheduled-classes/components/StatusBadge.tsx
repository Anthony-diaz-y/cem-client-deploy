import { obtenerEstadoClase } from "@/shared/utils/scheduledClassUtils";

interface StatusBadgeProps {
  scheduledDate: string;
  duration: number;
}

// Badge que muestra el estado actual de la clase
export default function StatusBadge({ scheduledDate, duration }: StatusBadgeProps) {
  const { texto, color, pulso } = obtenerEstadoClase(scheduledDate, duration);

  return (
    <div className="inline-flex items-center">
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white ${color} leading-tight`}>
        {pulso && (
          <span className="flex h-1.5 w-1.5 mr-1">
            <span className={`animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full ${color} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-white`}></span>
          </span>
        )}
        <span className="truncate max-w-[70px]">{texto}</span>
      </span>
    </div>
  );
}
