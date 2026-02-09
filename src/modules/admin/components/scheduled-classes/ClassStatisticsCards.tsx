"use client";

interface ClassStatisticsCardsProps {
  statistics: {
    total: number;
    active: number;
    inactive: number;
  };
}

// Tarjetas de estadísticas de clases
export default function ClassStatisticsCards({ statistics }: ClassStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cem-neutral-gray-600 mb-1">Total de Clases</p>
            <p className="text-3xl font-bold text-cem-neutral-gray-900">{statistics.total}</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>

      <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cem-neutral-gray-600 mb-1">Clases Activas</p>
            <p className="text-3xl font-bold text-green-600">{statistics.active}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cem-neutral-gray-600 mb-1">Clases Inactivas</p>
            <p className="text-3xl font-bold text-yellow-600">{statistics.inactive}</p>
          </div>
          <div className="text-4xl">❌</div>
        </div>
      </div>
    </div>
  );
}

