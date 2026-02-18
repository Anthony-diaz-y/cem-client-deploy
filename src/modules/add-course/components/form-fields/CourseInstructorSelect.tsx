import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { FieldValues, Path, UseFormRegister, UseFormSetValue, FieldErrors, PathValue } from "react-hook-form";
import { getAllInstructors, Instructor } from "@shared/services/adminAPI";
import { RootState } from "@shared/store/store";

interface CourseInstructorSelectProps<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    errors: FieldErrors<T>;
    initialData?: string[]; // Array of Instructor IDs
}

export default function CourseInstructorSelect<T extends FieldValues = FieldValues>({
    name,
    label,
    register,
    setValue,
    errors,
    initialData = [],
}: CourseInstructorSelectProps<T>) {
    const { token } = useSelector((state: RootState) => state.auth);
    const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);

    // State for local selection management
    const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>(initialData || []);
    const [prevInitialData, setPrevInitialData] = useState<string[]>(initialData || []);

    // Derived state adjustment (React recommended pattern)
    if (JSON.stringify(initialData) !== JSON.stringify(prevInitialData)) {
        setPrevInitialData(initialData || []);
        setSelectedInstructorIds(initialData || []);
    }

    // State for search/filter functionalities
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch instructors on mount
    useEffect(() => {
        const fetchInstructors = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await getAllInstructors(token);
                if (response && response.data && response.data.all) {
                    setAvailableInstructors(response.data.all.filter(i => i.active && i.approved));
                }
            } catch (error) {
                console.error("Error fetching instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [token]);

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
            validate: (value: string[]) => value.length > 0,
        });
    }, [name, register]);

    // Update form value when local state changes
    useEffect(() => {
        setValue(name, selectedInstructorIds as PathValue<T, Path<T>>);
    }, [selectedInstructorIds, name, setValue]);

    const handleSelectInstructor = (instructorId: string) => {
        if (!selectedInstructorIds.includes(instructorId)) {
            setSelectedInstructorIds([...selectedInstructorIds, instructorId]);
        }
        setSearchTerm("");
        setIsDropdownOpen(false);
    };

    const handleRemoveInstructor = (index: number) => {
        const updated = [...selectedInstructorIds];
        updated.splice(index, 1);
        setSelectedInstructorIds(updated);
    };

    // Filter available instructors based on search term and already selected IDs
    const filteredInstructors = availableInstructors.filter((instructor) => {
        const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const isNotSelected = !selectedInstructorIds.includes(instructor.id);
        return matchesSearch && isNotSelected;
    });

    // Get instructor details for display
    const getInstructorName = (id: string) => {
        // Find by id or _id
        const instructor = availableInstructors.find((i) => i.id === id || (i as any)._id === id);
        if (instructor) return instructor.name;

        // If still loading, return loading
        if (loading) return "Cargando...";

        // Final fallback if not found in available instructors
        return "Instructor no disponible o no encontrado";
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
                        placeholder={selectedInstructorIds.length > 0 ? "Agregar otro instructor..." : "Buscar instructor..."}
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

                        {!loading && filteredInstructors.length === 0 && (
                            <div className="p-4 text-sm text-cem-neutral-gray-500 text-center font-medium">
                                No se encontraron resultados.
                            </div>
                        )}

                        {!loading && filteredInstructors.map((instructor) => (
                            <div
                                key={instructor.id}
                                onClick={() => handleSelectInstructor(instructor.id)}
                                className="mx-2 px-6 py-3 rounded-xl cursor-pointer transition-all font-medium text-cem-neutral-gray-700 hover:bg-[#DCEEEF] hover:text-cem-primary"
                            >
                                <p className="text-sm font-medium">{instructor.name}</p>
                                <p className="text-xs opacity-70">{instructor.email}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Instructors List */}
            {selectedInstructorIds.length > 0 && (
                <ul className="mt-2 flex flex-col gap-2">
                    {selectedInstructorIds.map((id, index) => (
                        <li
                            key={id} // Use ID as key for better stability if order changes
                            className="flex items-center justify-between text-cem-neutral-gray-700 bg-cem-neutral-gray-50 px-3 py-2 rounded-md border border-cem-neutral-gray-200"
                        >
                            <span className="font-medium text-sm">{getInstructorName(id)}</span>
                            <button
                                type="button"
                                className="ml-2 text-cem-neutral-gray-500 hover:text-pink-200 transition-colors"
                                onClick={() => handleRemoveInstructor(index)}
                            >
                                <RiDeleteBin6Line className="text-lg" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} es requerido
                </span>
            )}
        </div>
    );
}
