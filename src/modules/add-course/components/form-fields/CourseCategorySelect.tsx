import { useEffect, useState, useRef } from "react";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FieldValues, Path, UseFormRegister, UseFormSetValue, FieldErrors, PathValue } from "react-hook-form";

// Define strict type for Category to avoid 'any'
interface Category {
    _id?: string;
    id?: string;
    name: string;
    description?: string;
    domain?: {
        id: string;
        name: string;
    };
}

interface CourseCategorySelectProps<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    errors: FieldErrors<T>;
    categories: Category[];
    initialData?: string; // Single ID for category
    loading?: boolean;
    domainName?: string; // New: filter by domain name (e.g., "Carreras" or "Sectores")
}

export default function CourseCategorySelect<T extends FieldValues = FieldValues>({
    name,
    label,
    register,
    setValue,
    errors,
    categories = [],
    initialData = "",
    loading = false,
    domainName,
}: CourseCategorySelectProps<T>) {
    // State for local selection management
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialData || "");
    const [prevInitialData, setPrevInitialData] = useState<string>(initialData || "");

    // Derived state adjustment (React recommended pattern)
    if (initialData !== prevInitialData) {
        setPrevInitialData(initialData || "");
        setSelectedCategoryId(initialData || "");
    }

    // State for search/filter functionalities
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Register the field
    useEffect(() => {
        register(name, {
            required: true,
        });
    }, [name, register]);

    // Update form value when local state changes
    useEffect(() => {
        setValue(name, selectedCategoryId as PathValue<T, Path<T>>);
    }, [selectedCategoryId, name, setValue]);

    const handleSelectCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setSearchTerm("");
        setIsDropdownOpen(false);
    };

    const handleRemoveCategory = () => {
        setSelectedCategoryId("");
    };

    // Filter available categories based on domain and search term
    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDomain = domainName
            ? category.domain?.name.toLowerCase() === domainName.toLowerCase()
            : true;
        return matchesSearch && matchesDomain;
    });

    // Get category name for display
    const getCategoryName = (id: string) => {
        const category = categories.find((c) => (c.id || c._id) === id);
        return category ? category.name : "";
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>

            <div className="flex flex-col space-y-3 relative" ref={dropdownRef}>
                {/* Custom Hybrid Input/Select */}
                <div className="relative">
                    <input
                        id={name}
                        type="text"
                        placeholder={selectedCategoryId ? "Buscar para cambiar..." : "Buscar categoría..."}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full h-[56px] px-6 bg-cem-neutral-gray-50/50 border-b-2 border-cem-neutral-gray-300 rounded-2xl text-cem-neutral-gray-900 font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all pr-10"
                        disabled={loading}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400 pointer-events-none">
                        {isDropdownOpen ? <BiSearch size={20} /> : <BiChevronDown size={24} />}
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-[64px] left-0 w-full bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeInUp max-h-60 overflow-y-auto">
                        {loading && (
                            <div className="p-4 text-sm text-cem-neutral-gray-500 text-center font-medium">
                                Cargando...
                            </div>
                        )}

                        {!loading && filteredCategories.length === 0 && (
                            <div className="p-4 text-sm text-cem-neutral-gray-500 text-center font-medium">
                                No se encontraron resultados.
                            </div>
                        )}

                        {!loading && filteredCategories.map((category) => (
                            <div
                                key={category.id || category._id}
                                onClick={() => handleSelectCategory((category.id || category._id) as string)}
                                className={`mx-2 px-6 py-3 rounded-xl cursor-pointer transition-all font-medium ${(category.id || category._id) === selectedCategoryId
                                    ? "bg-[#DCEEEF] text-cem-primary"
                                    : "text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                                    }`}
                            >
                                <p className="text-sm font-medium">{category.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Category Chip (Single) */}
            {selectedCategoryId && (
                <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-cem-neutral-gray-700 bg-cem-neutral-gray-50 px-3 py-2 rounded-md border border-cem-neutral-gray-200">
                        <span className="font-medium text-sm">{getCategoryName(selectedCategoryId)}</span>
                        <button
                            type="button"
                            className="ml-2 text-cem-neutral-gray-500 hover:text-pink-200 transition-colors"
                            onClick={handleRemoveCategory}
                        >
                            <RiDeleteBin6Line className="text-lg" />
                        </button>
                    </div>
                </div>
            )}

            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} es requerida
                </span>
            )}
        </div>
    );
}
