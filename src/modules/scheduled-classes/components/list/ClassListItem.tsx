"use client";

import { ClaseProgramada } from "@/types/scheduledClasses.types";
import PlatformBadge from "../PlatformBadge";
import StatusBadge from "../StatusBadge";
import { formatearFechaProgramada } from "@/shared/utils/scheduledClassUtils";

interface ClassListItemProps {
  clase: ClaseProgramada;
  onViewDetails: () => void;
}

// Item individual para vista de lista de clases
export default function ClassListItem({ clase, onViewDetails }: ClassListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{clase.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{clase.description}</p>
            </div>
            {clase.isEnrolled && (
              <span className="text-green-600 text-xl">✓</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📅</span>
              <span>{formatearFechaProgramada(clase.scheduledDate)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">⏱️</span>
              <span>{clase.duration} minutos</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">👥</span>
              <span>{clase.enrollmentCount} inscritos</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <PlatformBadge platform={clase.platform} variant="compact" />
            <StatusBadge scheduledDate={clase.scheduledDate} duration={clase.duration} />
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
