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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-[2rem] p-6 border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-cem-neutral-gray-600 transition-colors">Total de Clases</p>
            <p className="text-3xl font-black text-cem-neutral-gray-900 tracking-tight">{statistics.total}</p>
          </div>
          <div className="w-14 h-14 bg-cem-primary/10 rounded-2xl flex items-center justify-center text-3xl">📊</div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-cem-neutral-gray-600 transition-colors">Clases Activas</p>
            <p className="text-3xl font-black text-caribbeangreen-400 tracking-tight">{statistics.active}</p>
          </div>
          <div className="w-14 h-14 bg-caribbeangreen-400/10 rounded-2xl flex items-center justify-center text-3xl">✅</div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-cem-neutral-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-cem-neutral-gray-600 transition-colors">Clases Inactivas</p>
            <p className="text-3xl font-black text-red-400 tracking-tight">{statistics.inactive}</p>
          </div>
          <div className="w-14 h-14 bg-red-400/10 rounded-2xl flex items-center justify-center text-3xl">❌</div>
        </div>
      </div>
    </div>
  );
}

