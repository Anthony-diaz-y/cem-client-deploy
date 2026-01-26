import { Platform } from "@/types/scheduledClasses.types";
import { obtenerIconoPlataforma, obtenerColorPlataforma } from "@/shared/utils/scheduledClassUtils";

interface PlatformBadgeProps {
  platform: Platform;
  variant?: 'default' | 'compact';
}

// Badge visual para mostrar la plataforma de la clase
export default function PlatformBadge({ platform, variant = 'default' }: PlatformBadgeProps) {
  const icono = obtenerIconoPlataforma(platform);
  const colorClase = obtenerColorPlataforma(platform);

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${colorClase} leading-tight`}>
        <span className="mr-0.5 text-[9px]">{icono}</span>
        <span className="truncate max-w-[45px]">{platform}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold text-white ${colorClase}`}>
      <span className="text-lg mr-2">{icono}</span>
      <span>{platform}</span>
    </div>
  );
}
