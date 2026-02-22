import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import CountryCode from "@shared/data/countrycode.json";
import { ContactFormData } from "../types";
import { CONTACT_TEXTS } from "../constants/contact.constants";

interface CountryCodeDropdownProps {
  selectedCountryCode: string;
  countryCodeSearch: string;
  showCountryDropdown: boolean;
  countryDropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (code: string) => void;
  register: UseFormRegister<ContactFormData>;
}

const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({
  selectedCountryCode,
  countryCodeSearch,
  showCountryDropdown,
  countryDropdownRef,
  onToggle,
  onSearchChange,
  onSelect,
  register,
}) => {
  // Filtrar códigos de país basado en la búsqueda
  const filteredCountryCodes = CountryCode.filter((country) => {
    const searchLower = countryCodeSearch.toLowerCase();
    return (
      country.code.toLowerCase().includes(searchLower) ||
      country.country.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      className="flex w-[180px] flex-col gap-2 relative"
      ref={countryDropdownRef}
    >
      <div
        className="form-style cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <span className="text-cem-neutral-gray-900 font-medium">
          {selectedCountryCode || "Código"}
        </span>
        <FaChevronDown
          className={`text-cem-neutral-gray-400 transition-transform duration-300 ${
            showCountryDropdown ? "rotate-180" : ""
          }`}
          size={10}
        />
      </div>

      {showCountryDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-cem-neutral-gray-200 rounded-xl shadow-2xl z-50 max-h-72 overflow-hidden flex flex-col animate-fadeInDown">
          <div className="relative p-2 bg-cem-neutral-gray-50 border-b border-cem-neutral-gray-100">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400">
              <FaSearch size={12} />
            </div>
            <input
              type="text"
              placeholder={CONTACT_TEXTS.form.countryCode.placeholder}
              value={countryCodeSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full pl-8 pr-3 py-2 bg-white text-cem-neutral-gray-800 text-sm border border-cem-neutral-gray-200 rounded-lg focus:outline-none focus:border-cem-primary transition-all"
            />
          </div>

          <div className="overflow-y-auto max-h-56 custom-scrollbar">
            {filteredCountryCodes.length > 0 ? (
              filteredCountryCodes.map((country, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(country.code)}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-cem-teal-50 transition-colors flex items-center justify-between text-sm ${
                    selectedCountryCode === country.code
                      ? "bg-cem-teal-50/50 text-cem-primary font-bold"
                      : "text-cem-neutral-gray-700"
                  }`}
                >
                  <span className="flex-1 truncate mr-2">
                    {country.country}
                  </span>
                  <span className="text-cem-neutral-gray-500 font-mono text-[12px]">
                    {country.code}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-cem-neutral-gray-400 text-sm text-center">
                {CONTACT_TEXTS.form.countryCode.noResults}
              </div>
            )}
          </div>
        </div>
      )}
      <input
        type="hidden"
        {...register("countrycode")}
        value={selectedCountryCode}
      />
    </div>
  );
};

export default CountryCodeDropdown;
