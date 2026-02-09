"use client";

import { Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";
import { useState, useEffect, useRef, useCallback } from "react";

interface InstructorClassFiltersProps {
  onSearch: (search: string) => void;
  onPlatformChange: (platform: Platform | 'all') => void;
  onStatusChange: (isActive: boolean | null) => void;
  onDateChange?: (date: string | null) => void;
  onCreatedByChange?: (createdBy: string) => void;
  onClearFilters: () => void;
  initialSearch?: string;
  initialPlatform?: Platform | 'all';
  initialStatus?: boolean | null;
  initialDate?: string | null;
  initialCreatedBy?: string;
}

export default function InstructorClassFilters({
  onSearch,
  onPlatformChange,
  onStatusChange,
  onDateChange,
  onCreatedByChange,
  onClearFilters,
  initialSearch = '',
  initialPlatform = 'all',
  initialStatus = null,
  initialDate = null,
  initialCreatedBy = '',
}: InstructorClassFiltersProps) {
  const [searchValue, setSearchValue] = useState(() => initialSearch);
  const [platform, setPlatform] = useState<Platform | 'all'>(() => initialPlatform);
  const [status, setStatus] = useState<boolean | null>(() => initialStatus);
  const [selectedDate, setSelectedDate] = useState<string>(() => initialDate || '');
  const [createdByValue, setCreatedByValue] = useState(() => initialCreatedBy);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const createdByTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Efecto para el debounce de búsqueda
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchValue || searchValue.trim() === '') {
      onSearch('');
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(searchValue.trim());
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, onSearch]);

  useEffect(() => {
    if (!onCreatedByChange) return;

    if (createdByTimeoutRef.current) {
      clearTimeout(createdByTimeoutRef.current);
    }

    createdByTimeoutRef.current = setTimeout(() => {
      onCreatedByChange(createdByValue.trim());
    }, 300);

    return () => {
      if (createdByTimeoutRef.current) {
        clearTimeout(createdByTimeoutRef.current);
      }
    };
  }, [createdByValue, onCreatedByChange]);

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setPlatform('all');
    setStatus(null);
    setSelectedDate('');
    setCreatedByValue('');
    onSearch('');
    if (onDateChange) {
      onDateChange(null);
    }
    if (onCreatedByChange) {
      onCreatedByChange('');
    }
    onClearFilters();
  }, [onClearFilters, onSearch, onDateChange, onCreatedByChange]);

  const hasActiveFilters = searchValue || platform !== 'all' || status !== null || selectedDate || createdByValue;

  return (
    <div className="bg-cem-cardbackground rounded-xl p-6 border border-cem-neutral-gray-200 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
          🔍 Buscar por nombre
        </label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar clases por título..."
          className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 placeholder-cem-neutral-gray-400 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
        />
      </div>

      {onCreatedByChange && (
        <div>
          <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
            👤 Buscar por creador
          </label>
          <input
            type="text"
            value={createdByValue}
            onChange={(e) => setCreatedByValue(e.target.value)}
            placeholder="Buscar por nombre o apellido del creador..."
            className="w-full px-4 py-2 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 placeholder-cem-neutral-gray-400 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

