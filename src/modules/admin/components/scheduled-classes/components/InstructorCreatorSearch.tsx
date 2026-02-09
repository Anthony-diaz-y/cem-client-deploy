"use client";

import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  accountType?: string;
}

interface InstructorCreatorSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (creatorId: string) => void;
  onClear?: () => void;
  instructors: Creator[];
  placeholder?: string;
}

export default function InstructorCreatorSearch({
  value,
  onChange,
  onSelect,
  onClear,
  instructors,
  placeholder = "Buscar por nombre o apellido...",
}: InstructorCreatorSearchProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCreators = instructors.filter((creator) => {
    const fullName = `${creator.firstName} ${creator.lastName}`.toLowerCase();
    const searchTerm = value.toLowerCase();
    return fullName.includes(searchTerm);
  });

  const handleCreatorSelect = (creator: Creator) => {
    const fullName = `${creator.firstName} ${creator.lastName}`;
    onChange(fullName);
    setIsDropdownOpen(false);
    onSelect?.(creator.id);
  };

  const handleClear = () => {
    onChange("");
    setIsDropdownOpen(false);
    onClear?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-cem-neutral-gray-700 mb-2">
        👤 Instructor / Creador
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 bg-cem-background border border-cem-neutral-gray-200 rounded-lg text-cem-neutral-gray-900 placeholder-cem-neutral-gray-400 focus:ring-2 focus:ring-cem-primary focus:border-transparent transition-all"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors"
            type="button"
          >
            <FiX size={18} />
          </button>
        )}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors"
          type="button"
        >
          <FiChevronDown
            size={20}
            className={
              isDropdownOpen
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
        </button>
      </div>
      {isDropdownOpen && instructors.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-cem-neutral-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredCreators.length > 0 ? (
            filteredCreators.map((creator) => (
              <button
                key={creator.id}
                onClick={() => handleCreatorSelect(creator)}
                className="w-full px-4 py-2 text-left text-cem-neutral-gray-900 hover:bg-cem-neutral-gray-50 transition-colors flex items-center justify-between"
                type="button"
              >
                <span>
                  {creator.firstName} {creator.lastName}
                  {creator.accountType && (
                    <span className="ml-2 text-xs text-cem-neutral-gray-500">
                      ({creator.accountType === "Admin" ? "Admin" : "Instructor"})
                    </span>
                  )}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-cem-neutral-gray-500 text-sm">
              No se encontraron creadores
            </div>
          )}
        </div>
      )}
    </div>
  );
}

