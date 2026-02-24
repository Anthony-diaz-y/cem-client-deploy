import React from "react";
import { FiPlus } from "react-icons/fi";

interface AdminHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-medium text-cem-neutral-gray-900 tracking-tight">
                    {title}
                </h1>
                <p className="text-cem-neutral-gray-600 font-medium max-w-3xl leading-relaxed text-sm md:text-base">
                    {description}
                </p>
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 whitespace-nowrap h-fit"
                >
                    <FiPlus className="text-xl" />
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
};
