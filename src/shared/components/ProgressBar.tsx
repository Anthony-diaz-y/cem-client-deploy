"use client";

import React from "react";

interface ProgressBarProps {
  completed: number;
  height?: string;
  isLabelVisible?: boolean;
  className?: string;
  bgColor?: string;
  completedColor?: string;
}

/**
 * ProgressBar - Componente de barra de progreso simple y ligero
 * Reemplaza @ramonak/react-progress-bar para evitar problemas de dependencias
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  height = "8px",
  isLabelVisible = false,
  className = "",
  bgColor = "bg-richblack-700",
  completedColor = "bg-yellow-50",
}) => {
  // Asegurar que completed esté entre 0 y 100
  const percentage = Math.min(Math.max(completed, 0), 100);

  return (
    <div className={`w-full ${bgColor} rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`${completedColor} h-full transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${percentage}%`}
      >
        {isLabelVisible && (
          <span className="text-xs text-richblack-900 font-semibold px-2">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

