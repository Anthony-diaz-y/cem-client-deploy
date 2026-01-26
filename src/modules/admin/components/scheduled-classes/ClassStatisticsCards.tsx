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
      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-richblack-400 mb-1">Total de Clases</p>
            <p className="text-3xl font-bold text-richblack-5">{statistics.total}</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>

      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-richblack-400 mb-1">Clases Activas</p>
            <p className="text-3xl font-bold text-green-400">{statistics.active}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-richblack-400 mb-1">Clases Inactivas</p>
            <p className="text-3xl font-bold text-yellow-100">{statistics.inactive}</p>
          </div>
          <div className="text-4xl">❌</div>
        </div>
      </div>
    </div>
  );
}

