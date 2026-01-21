import { useEffect, useState } from "react";

import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { ChipInputProps } from "../../types";
import { Course } from "../../../course/types";

// Componente de entrada de chips (etiquetas)
export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
}: ChipInputProps) {
  const { editCourse, course } = useSelector(
    (state: RootState) => state.course
  );

  const [chips, setChips] = useState<string[]>(() => {
    if (editCourse && course) {
      const courseData = course as Course;
      if (courseData.tag && Array.isArray(courseData.tag)) {
        return courseData.tag;
      }
    }
    return [];
  });

  useEffect(() => {
    register(name, { required: true, validate: (value) => value.length > 0 });
  }, [name, register]);

  useEffect(() => {
    setValue(name, chips);
  }, [chips, name, setValue]);

  // Manejar entrada cuando se agregan chips
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const chipValue = target.value.trim();
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        target.value = "";
      }
    }
  };

  // Manejar eliminación de un chip
  const handleDeleteChip = (chipIndex: number) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-y-2">
        {chips?.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}

            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>
      {errors[name as keyof typeof errors] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

