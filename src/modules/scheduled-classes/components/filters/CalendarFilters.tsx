"use client";

import { Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";

interface CalendarFiltersProps {
  selectedPlatform: Platform | 'all';
  onPlatformChange: (platform: Platform | 'all') => void;
  showActiveOnly: boolean;
  onActiveToggle: () => void;
}

// Filtros para el calendario de clases
export default function CalendarFilters({
  selectedPlatform,
  onPlatformChange,
  showActiveOnly,
  onActiveToggle,
}: CalendarFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">Plataforma:</label>
          <select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value as Platform | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las plataformas</option>
            {PLATAFORMAS.map((plat) => (
              <option key={plat.value} value={plat.value}>
                {plat.icon} {plat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={onActiveToggle}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Solo clases activas
            </span>
          </label>
        </div>

        {(selectedPlatform !== 'all' || showActiveOnly) && (
          <button
            onClick={() => {
              onPlatformChange('all');
              if (showActiveOnly) onActiveToggle();
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
