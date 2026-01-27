import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-[296px] flex items-center justify-center gap-3 font-medium bg-white text-gray-700 rounded-full py-2.5 px-3.5 text-base leading-6 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle className="w-6 h-6 shrink-0" />
      <span>Google</span>
    </button>
  );
};

export default GoogleButton;

