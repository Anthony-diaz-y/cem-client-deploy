"use client";

import React from "react";
import { brandColors } from "@shared/design-tokens";
import type { ConcentricCirclesProps } from "../../../types";

/**
 * ConcentricCircles
 * Componente decorativo reutilizable: círculos concéntricos con "electrón" orbitando.
 */
export const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  size = 400,
  circles = 4,
  borderColor = brandColors.primary.light,
  dotColor = brandColors.primary.DEFAULT,
  showDot = true,
  dotSize = 10,
  className = "",
  dotClassName = "",
  style = {},
}) => {
  // Tamaños (del mayor al menor)
  const circleSizes = [size, size * 0.8, size * 0.6, size * 0.4].slice(
    0,
    circles,
  );

  // Offsets para centrar cada círculo dentro del contenedor
  const circleOffsets = circleSizes.map(
    (circleSize) => (size - circleSize) / 2,
  );

  // Animaciones
  const animationDurations = [8, 10, 12, 15];
  const animationDelays = [0, 0.5, 1, 1.5];

  return (
    <div
      className={`absolute z-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      {circleSizes.map((circleSize, index) => {
        const radius = circleSize / 2;
        const electronRadius = radius - dotSize / 2;

        return (
          <React.Fragment key={index}>
            {/* Círculo */}
            <div
              className="absolute"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: "50%",
                border: `1px solid ${borderColor}`,
                top: `${circleOffsets[index]}px`,
                left: `${circleOffsets[index]}px`,
                pointerEvents: "none",
              }}
            />

            {/* Órbita + punto */}
            {showDot && (
              <div
                className="absolute electron-orbit-container"
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  top: `${circleOffsets[index]}px`,
                  left: `${circleOffsets[index]}px`,
                  pointerEvents: "none",
                  animation: `electron-orbit ${animationDurations[index]}s linear infinite`,
                  animationDelay: `${animationDelays[index]}s`,
                }}
              >
                <div
                  className={dotClassName}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    backgroundColor: dotColor,
                    transform: `translate(-50%, -${electronRadius + dotSize / 2}px)`,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

