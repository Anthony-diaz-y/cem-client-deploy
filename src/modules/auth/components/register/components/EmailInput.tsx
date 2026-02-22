import React from "react";
import { EMAIL_ERROR_MESSAGE } from "../utils/validation";

interface EmailInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  isValid?: boolean;
  showValidationMessage?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Correo",
  required = false,
  disabled = false,
  isValid = true,
  showValidationMessage = false,
}) => {
  return (
    <div className="w-[296px]">
      <input
        type="email"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-[296px] rounded-lg border px-4 py-3 text-base leading-6 text-gray-900 bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          showValidationMessage && value && !isValid
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-cem-primary"
        }`}
      />
      {showValidationMessage && value && !isValid && (
        <p className="text-xs leading-4 text-red-500 mt-2 mb-0">
          {EMAIL_ERROR_MESSAGE}
        </p>
      )}
    </div>
  );
};

export default EmailInput;
