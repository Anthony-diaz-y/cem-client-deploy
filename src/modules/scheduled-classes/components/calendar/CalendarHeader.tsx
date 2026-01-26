"use client";

interface CalendarHeaderProps {
  mesActual: string;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onHoy: () => void;
}

export default function CalendarHeader({
  mesActual,
  onMesAnterior,
  onMesSiguiente,
  onHoy,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white capitalize mb-1 tracking-tight">
              {mesActual}
            </h2>
            <p className="text-blue-100 text-sm font-medium">
              Calendario de Clases Programadas
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onHoy}
              className="px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
            >
              Hoy
            </button>

            <button
              onClick={onMesAnterior}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
              aria-label="Mes anterior"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={onMesSiguiente}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
              aria-label="Mes siguiente"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
