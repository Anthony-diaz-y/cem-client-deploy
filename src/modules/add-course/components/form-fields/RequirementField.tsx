import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FieldValues, Path } from "react-hook-form";
import { RequirementFieldProps } from "../../types/index";

// Campo de formulario para requisitos/instrucciones
export default function RequirementsField<T extends FieldValues = FieldValues>({
  name,
  label,
  register,
  setValue,
  errors,
  initialData,
}: RequirementFieldProps<T> & { initialData?: string[] }) {
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState<string[]>(initialData || []);

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value: string[]) => value.length > 0,
    });
  }, [name, register]);

  useEffect(() => {
    setValue(name, requirementsList as T[Path<T>]);
  }, [requirementsList, name, setValue]);

  // Agregar instrucción
  const handleAddRequirement = () => {
    if (requirement && !requirementsList.includes(requirement)) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  // Eliminar instrucción
  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col space-y-3">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder={`Ingresa ${label.toLowerCase()}`}
          className="form-style w-full"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddRequirement}
            className="flex items-center gap-x-1 font-bold text-cem-primary hover:text-cem-primary-dark transition-all group/add"
          >
            <div className="w-5 h-5 rounded-md bg-cem-primary/10 flex items-center justify-center group-hover/add:bg-cem-primary group-hover/add:text-white transition-all">
              <span className="text-sm">+</span>
            </div>
            <span className="text-sm">Agregar</span>
          </button>
        </div>
      </div>

      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-cem-neutral-gray-700">
              <span className="flex-1">{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                <RiDeleteBin6Line className="text-pink-200 text-sm hover:scale-125 duration-200" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name as keyof typeof errors] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

