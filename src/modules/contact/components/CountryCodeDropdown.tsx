import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
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
    <div className="flex w-[200px] flex-col gap-2 relative" ref={countryDropdownRef}>
      <div
        className="form-style cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <span className="text-richblack-200">
          {selectedCountryCode || "Seleccionar"}
        </span>
        <FaChevronDown
          className={`text-richblack-400 transition-transform ${
            showCountryDropdown ? "rotate-180" : ""
          }`}
          size={12}
        />
      </div>
      {showCountryDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-richblack-800 border border-richblack-700 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
          <input
            type="text"
            placeholder={CONTACT_TEXTS.form.countryCode.placeholder}
            value={countryCodeSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2 bg-richblack-900 text-richblack-200 border-b border-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-50"
          />
          <div className="overflow-y-auto max-h-48 custom-scrollbar">
            {filteredCountryCodes.length > 0 ? (
              filteredCountryCodes.map((country, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(country.code)}
                  className={`px-3 py-2 cursor-pointer hover:bg-richblack-700 text-richblack-200 text-sm ${
                    selectedCountryCode === country.code
                      ? "bg-richblack-700 text-yellow-50"
                      : ""
                  }`}
                >
                  <span className="font-medium">{country.code}</span> -{" "}
                  {country.country}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-richblack-400 text-sm text-center">
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

