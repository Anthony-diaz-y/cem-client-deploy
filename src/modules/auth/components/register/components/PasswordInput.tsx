import React from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { getPasswordValidations } from "../utils/validation";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showPassword: boolean;
  onToggleVisibility: () => void;
  showValidationMessage?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  showRequirements?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Contraseña",
  required = false,
  disabled = false,
  showPassword,
  onToggleVisibility,
  showValidationMessage = false,
  isValid = true,
  errorMessage,
  showRequirements = false,
}) => {
  const validations = getPasswordValidations(value);

  const Requirement = ({ label, met }: { label: string; met: boolean }) => (
    <div
      className={`flex items-center gap-2 text-[11px] transition-colors ${met ? "text-green-600" : "text-gray-400"}`}
    >
      {met ? (
        <AiOutlineCheckCircle className="w-3.5 h-3.5" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="w-[296px] flex flex-col gap-2">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-[296px] rounded-lg border px-4 py-3 pr-12 text-base leading-6 text-gray-900 bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            showValidationMessage && value && !isValid
              ? "border-red-500 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
              : "border-gray-300 focus:border-cem-primary focus:shadow-[0_0_0_2px_rgba(2,129,158,0.1)]"
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cem-primary transition-colors disabled:opacity-50 bg-transparent border-0 p-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="w-5 h-5" />
          ) : (
            <AiOutlineEye className="w-5 h-5" />
          )}
        </button>
      </div>

      {showRequirements && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 px-1 py-1 bg-gray-50 rounded-lg border border-gray-100 italic">
          <Requirement
            label="Mínimo 8 caracteres"
            met={validations.minLength}
          />
          <Requirement label="Una mayúscula" met={validations.uppercase} />
          <Requirement label="Una minúscula" met={validations.lowercase} />
          <Requirement label="Un número" met={validations.numbers} />
        </div>
      )}

      {showValidationMessage && value && !isValid && errorMessage && (
        <p className="text-xs leading-4 text-red-500 mt-1 flex items-center gap-1">
          <AiOutlineCloseCircle /> {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
