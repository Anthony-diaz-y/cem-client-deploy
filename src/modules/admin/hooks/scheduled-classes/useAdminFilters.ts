import { useState } from "react";
import { Platform } from "@/types/scheduledClasses.types";
import { useDebounce } from "./useDebounce";

interface Creator {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UseAdminFiltersProps {
  initialSearch?: string;
  initialPlatform?: Platform | 'all';
  initialStatus?: boolean | null;
  initialDate?: string | null;
  initialInstructor?: string | 'all';
  initialCreatedBy?: string;
  instructors?: Creator[];
  onSearch: (search: string) => void;
  onPlatformChange: (platform: Platform | 'all') => void;
  onStatusChange: (isActive: boolean | null) => void;
  onDateChange?: (date: string | null) => void;
  onInstructorChange?: (instructorId: string | 'all') => void;
  onCreatedByChange?: (createdBy: string) => void;
}

function getInitialInstructorValue(
  initialCreatedBy: string,
  initialInstructor: string | 'all',
  instructors: Creator[]
): string {
  if (initialCreatedBy) return initialCreatedBy;
  if (initialInstructor !== 'all') {
    const instructor = instructors.find(i => i.id === initialInstructor);
    if (instructor) {
      return `${instructor.firstName} ${instructor.lastName}`;
    }
  }
  return '';
}

export function useAdminFilters({
  initialSearch = '',
  initialPlatform = 'all',
  initialStatus = null,
  initialDate = null,
  initialInstructor = 'all',
  initialCreatedBy = '',
  instructors = [],
  onSearch,
  onPlatformChange,
  onStatusChange,
  onDateChange,
  onInstructorChange,
  onCreatedByChange,
}: UseAdminFiltersProps) {
  const [searchValue, setSearchValue] = useState(() => initialSearch);
  const [platform, setPlatform] = useState<Platform | 'all'>(() => initialPlatform);
  const [status, setStatus] = useState<boolean | null>(() => initialStatus);
  const [selectedDate, setSelectedDate] = useState<string>(() => initialDate || '');
  const [instructorCreatorValue, setInstructorCreatorValue] = useState(() => 
    getInitialInstructorValue(initialCreatedBy, initialInstructor, instructors)
  );


  useDebounce(
    searchValue,
    300,
    (value) => onSearch(value.trim()),
    true
  );

  useDebounce(
    instructorCreatorValue,
    300,
    (value) => {
      const trimmedValue = value.trim();
      onCreatedByChange?.(trimmedValue);
    },
    false
  );

  const handleClearFilters = () => {
    setSearchValue('');
    setPlatform('all');
    setStatus(null);
    setSelectedDate('');
    setInstructorCreatorValue('');
    onSearch('');
    onPlatformChange('all');
    onStatusChange(null);
    onDateChange?.(null);
    onInstructorChange?.('all');
    onCreatedByChange?.('');
  };

  const hasActiveFilters = searchValue || platform !== 'all' || status !== null || selectedDate || instructorCreatorValue;

  return {
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
    handleClearFilters,
  };
}


