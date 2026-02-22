import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiCheck, FiPlus } from "react-icons/fi";
import { AdminCourse } from "@shared/services/admin/types";
import { getAllCoursesAdmin } from "@shared/services/admin/courses";

interface CourseMultiSelectProps {
  selectedCourseIds: string[];
  onChange: (ids: string[]) => void;
  token: string;
}

export default function CourseMultiSelect({
  selectedCourseIds,
  onChange,
  token,
}: CourseMultiSelectProps) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await getAllCoursesAdmin(token, { limit: 100 }, true);
      if (result?.data) {
        setCourses(result.data);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedCourseIds.includes(course.id),
  );

  const toggleCourse = (id: string) => {
    const newSelected = selectedCourseIds.includes(id)
      ? selectedCourseIds.filter((cid) => cid !== id)
      : [...selectedCourseIds, id];
    onChange(newSelected);
  };

  const removeCourse = (id: string) => {
    onChange(selectedCourseIds.filter((cid) => cid !== id));
  };

  const selectedCourses = courses.filter((c) =>
    selectedCourseIds.includes(c.id),
  );

  return (
    <div className="w-full space-y-4">
      <label className="text-sm font-bold text-cem-neutral-gray-700 block ml-1">
        Asociar cursos a la ruta
      </label>

      {/* Selected Items Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-cem-primary/10 text-cem-primary rounded-full text-xs font-bold border border-cem-primary/20 animate-in zoom-in duration-200"
          >
            <span className="truncate max-w-[150px]">{course.courseName}</span>
            <button
              type="button"
              onClick={() => removeCourse(course.id)}
              className="hover:bg-cem-primary/20 rounded-full p-0.5 transition-colors"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
        {selectedCourseIds.length === 0 && (
          <p className="text-sm text-cem-neutral-gray-400 italic py-1">
            No hay cursos seleccionados.
          </p>
        )}
      </div>

      {/* Dropdown Search */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de curso para añadir..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full h-12 pl-10 pr-4 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-xl text-sm focus:bg-white focus:border-cem-primary outline-none transition-all"
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {loading ? (
              <div className="p-4 text-center text-sm text-cem-neutral-gray-500">
                Cargando cursos...
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="p-2 space-y-1">
                {filteredCourses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      toggleCourse(course.id);
                      setSearchTerm("");
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-cem-neutral-gray-50 rounded-xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cem-primary/5 flex items-center justify-center text-cem-primary group-hover:bg-cem-primary/10">
                        <FiPlus />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-cem-neutral-gray-900 leading-none">
                          {course.courseName}
                        </p>
                        <p className="text-[10px] text-cem-neutral-gray-500 mt-1">
                          {course.instructor?.name || "Instructor"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-cem-neutral-gray-400 italic">
                {searchTerm
                  ? "No se encontraron más cursos."
                  : "Empieza a escribir para buscar..."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
