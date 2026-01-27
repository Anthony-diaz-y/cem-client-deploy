import React from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  placeholder = "Código de 6 carácteres",
  required = false,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Solo números
    if (newValue.length <= 6) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={6}
      className="w-[296px] rounded-lg border border-gray-300 px-4 py-3 text-base leading-6 text-gray-900 bg-white focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
    />
  );
};

export default OtpInput;
