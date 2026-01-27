import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PASSWORD_ERROR_MESSAGE } from "../utils/validation";

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
  errorMessage = PASSWORD_ERROR_MESSAGE,
}) => {
  return (
    <div className="w-[296px]">
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
          className={`w-[296px] rounded-lg border px-4 py-3 pr-12 text-base leading-6 text-gray-900 bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            showValidationMessage && value && !isValid
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-teal-500"
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 bg-transparent border-0 p-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="w-5 h-5" />
          ) : (
            <AiOutlineEye className="w-5 h-5" />
          )}
        </button>
      </div>
      {showValidationMessage && value && !isValid && (
        <p className="text-xs leading-4 text-red-500 mt-2 mb-0">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;

