"use client";

import { Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS, SCHEDULED_CLASSES_TEXTS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";

interface StudentClassFiltersProps {
  selectedPlatform: Platform | 'all';
  onPlatformChange: (platform: Platform | 'all') => void;
  enrolledFilter: 'all' | 'enrolled' | 'not-enrolled';
  onEnrolledFilterChange: (filter: 'all' | 'enrolled' | 'not-enrolled') => void;
}

// Filtros específicos para estudiantes
export default function StudentClassFilters({
  selectedPlatform,
  onPlatformChange,
  enrolledFilter,
  onEnrolledFilterChange,
}: StudentClassFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">{SCHEDULED_CLASSES_TEXTS.components.filters.student.platform}</label>
          <select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value as Platform | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{SCHEDULED_CLASSES_TEXTS.components.filters.student.allPlatforms}</option>
            {PLATAFORMAS.map((plat) => (
              <option key={plat.value} value={plat.value}>
                {plat.icon} {plat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">{SCHEDULED_CLASSES_TEXTS.components.filters.student.enrollment}</label>
          <select
            value={enrolledFilter}
            onChange={(e) => onEnrolledFilterChange(e.target.value as 'all' | 'enrolled' | 'not-enrolled')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{SCHEDULED_CLASSES_TEXTS.components.filters.student.allClasses}</option>
            <option value="enrolled">{SCHEDULED_CLASSES_TEXTS.components.filters.student.myEnrolled}</option>
            <option value="not-enrolled">{SCHEDULED_CLASSES_TEXTS.components.filters.student.available}</option>
          </select>
        </div>

        {(selectedPlatform !== 'all' || enrolledFilter !== 'all') && (
          <button
            onClick={() => {
              onPlatformChange('all');
              onEnrolledFilterChange('all');
            }}
            className="text-sm text-cem-primary hover:text-cem-primary-dark font-medium"
          >
            {SCHEDULED_CLASSES_TEXTS.components.filters.student.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}

