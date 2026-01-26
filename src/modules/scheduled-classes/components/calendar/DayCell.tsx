"use client";

import { ClaseProgramada } from "@/types/scheduledClasses.types";
import ClassCard from "../ClassCard";

interface DayCellProps {
  fecha: string;
  clases: ClaseProgramada[];
  esHoy: boolean;
  esMesActual: boolean;
  onClassClick: (clase: ClaseProgramada) => void;
}

// Celda individual del calendario que muestra un día y sus clases
export default function DayCell({ fecha, clases, esHoy, esMesActual, onClassClick }: DayCellProps) {
  const numeroDia = parseInt(fecha.split('-')[2], 10);

  return (
    <div
      className={`min-h-[180px] border-r border-b border-gray-200 p-2.5 ${!esMesActual ? 'bg-gray-50/50' : 'bg-white'
        } ${esHoy ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/30' : ''} transition-colors hover:bg-gray-50/80`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={`text-sm font-semibold ${esHoy
              ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md'
              : esMesActual
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}
        >
          {numeroDia}
        </span>
        {clases.length > 0 && (
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            {clases.length}
          </span>
        )}
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[140px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {clases.map((clase) => (
          <ClassCard key={clase.id} clase={clase} onClick={() => onClassClick(clase)} />
        ))}
      </div>
    </div>
  );
}
