import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    label,
    icon,
    className = "",
    disabled = false
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-x-2 rounded-lg bg-cem-primary px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-cem-primary-dark hover:shadow-lg hover:shadow-cem-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {icon || <span className="text-lg font-bold">+</span>}
            <span>{label}</span>
        </button>
    );
};
