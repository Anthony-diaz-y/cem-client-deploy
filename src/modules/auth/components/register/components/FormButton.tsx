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
      className="w-[296px] font-bold text-white bg-cem-primary rounded-full py-3 px-4 text-base leading-6 shadow-md hover:bg-cem-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-0 active:scale-[0.98]"
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};

export default FormButton;
