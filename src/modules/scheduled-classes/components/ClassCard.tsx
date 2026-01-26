"use client";

import { ClaseProgramada } from "@/types/scheduledClasses.types";
import PlatformBadge from "./PlatformBadge";
import StatusBadge from "./StatusBadge";
import { formatearSoloHora } from "@/shared/utils/scheduledClassUtils";

interface ClassCardProps {
  clase: ClaseProgramada;
  onClick: () => void;
}

export default function ClassCard({ clase, onClick }: ClassCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-white to-gray-50 rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-400 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 flex-1 leading-tight">
          {clase.title}
        </h4>
        {clase.isEnrolled && (
          <span className="ml-1.5 text-green-600 text-[10px] flex-shrink-0">✓</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center text-[10px] text-gray-600 font-medium">
          <span className="mr-0.5">🕐</span>
          <span>{formatearSoloHora(clase.scheduledDate)}</span>
        </div>

        <PlatformBadge platform={clase.platform} variant="compact" />
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <StatusBadge scheduledDate={clase.scheduledDate} duration={clase.duration} />

        {clase.enrollmentCount > 0 && (
          <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
            <span>👥</span>
            <span>{clase.enrollmentCount}</span>
          </span>
        )}
      </div>
    </div>
  );
}
