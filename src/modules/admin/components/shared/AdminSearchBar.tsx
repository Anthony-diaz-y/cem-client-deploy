import React from "react";
import { FiSearch } from "react-icons/fi";

interface AdminSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    isSearching?: boolean;
    className?: string;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
    value,
    onChange,
    placeholder = "Buscar...",
    label,
    isSearching = false,
    className = "w-full md:w-[424px]",
}) => {
    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="text-[13px] font-bold text-cem-neutral-gray-700 mb-2 ml-1 block">
                    {label}
                </label>
            )}
            <div className="relative group">
                <FiSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cem-primary transition-colors"
                    size={18}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-14 pl-12 pr-12 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-lg text-sm font-semibold text-cem-neutral-gray-600 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
                />
                {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-3 border-cem-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
