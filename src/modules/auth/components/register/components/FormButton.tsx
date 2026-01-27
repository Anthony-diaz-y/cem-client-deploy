import React from "react";

interface FormButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "text";
}

const FormButton: React.FC<FormButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = "primary",
}) => {
  if (variant === "text") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 bg-transparent border-0 p-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-[296px] font-medium text-white bg-[#14b8a6] rounded-full py-2.5 px-3.5 text-base leading-6 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-0"
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};

export default FormButton;

