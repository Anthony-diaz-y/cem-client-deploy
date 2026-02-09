"use client";

import { Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";
import InstructorCreatorSearch from "./components/InstructorCreatorSearch";
import { useAdminFilters } from "../../hooks/scheduled-classes/useAdminFilters";

interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  accountType?: string;
}

interface AdminClassFiltersProps {
  onSearch: (search: string) => void;
  onPlatformChange: (platform: Platform | 'all') => void;
  onStatusChange: (isActive: boolean | null) => void;
  onDateChange?: (date: string | null) => void;
  onInstructorChange?: (instructorId: string | 'all') => void;
  onCreatedByChange?: (createdBy: string) => void;
  onClearFilters: () => void;
  initialSearch?: string;
  initialPlatform?: Platform | 'all';
  initialStatus?: boolean | null;
  initialDate?: string | null;
  initialInstructor?: string | 'all';
  initialCreatedBy?: string;
  instructors?: Creator[];
}

export default function AdminClassFilters({
  onSearch,
  onPlatformChange,
  onStatusChange,
  onDateChange,
  onInstructorChange,
  onCreatedByChange,
  onClearFilters,
  initialSearch = '',
  initialPlatform = 'all',
  initialStatus = null,
  initialDate = null,
  initialInstructor = 'all',
  initialCreatedBy = '',
  instructors = [],
}: AdminClassFiltersProps) {
  const {
    searchValue,
    setSearchValue,
    platform,
    setPlatform,
    status,
    setStatus,
    selectedDate,
    setSelectedDate,
    instructorCreatorValue,
    setInstructorCreatorValue,
    hasActiveFilters,
    handleClearFilters: clearFilters,
  } = useAdminFilters({
    initialSearch,
    initialPlatform,
    initialStatus,
    initialDate,
    initialInstructor,
    initialCreatedBy,
    instructors,
    onSearch,
    onPlatformChange,
    onStatusChange,
    onDateChange,
    onInstructorChange,
    onCreatedByChange,
  });

  const handleClearFilters = () => {
    clearFilters();
    onClearFilters();
  };

  const handleInstructorSelect = (creatorId: string) => {
    onInstructorChange?.(creatorId);
  };

  const handleInstructorClear = () => {
    onInstructorChange?.('all');
    onCreatedByChange?.('');
  };

  return (
    <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 space-y-4 shadow-sm">
      {/* Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
            🔍 Buscar por nombre
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar clases por título o descripción..."
            className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 placeholder-cem-neutral-gray-400 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
          />
        </div>

        {(onCreatedByChange || onInstructorChange) && (
          <InstructorCreatorSearch
            value={instructorCreatorValue}
            onChange={setInstructorCreatorValue}
            onSelect={handleInstructorSelect}
            onClear={handleInstructorClear}
            instructors={instructors}
          />
        )}
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
            Plataforma
          </label>
          <select
            value={platform}
            onChange={(e) => {
              const value = e.target.value as Platform | 'all';
              setPlatform(value);
              onPlatformChange(value);
            }}
            className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
          >
            <option value="all">Todas las plataformas</option>
            {PLATAFORMAS.map((plat) => (
              <option key={plat.value} value={plat.value}>
                {plat.icon} {plat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
            Estado
          </label>
          <select
            value={status === null ? 'all' : status ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              let newStatus: boolean | null;
              if (value === 'all') {
                newStatus = null;
              } else if (value === 'active') {
                newStatus = true;
              } else {
                newStatus = false;
              }
              setStatus(newStatus);
              onStatusChange(newStatus);
            }}
            className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
          >
            <option value="all">Todas</option>
            <option value="active">Solo Activas</option>
            <option value="inactive">Solo Inactivas</option>
          </select>
        </div>

        {onDateChange && (
          <div>
            <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
              📅 Filtrar por fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const dateValue = e.target.value;
                setSelectedDate(dateValue);
                onDateChange(dateValue || null);
              }}
              className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm shadow-md"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
