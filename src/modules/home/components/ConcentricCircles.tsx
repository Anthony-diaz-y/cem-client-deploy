import React from "react";
import { brandColors } from "@shared/design-tokens";

interface ConcentricCirclesProps {
  size?: number;
  circles?: number;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  size = 400,
  circles = 4,
  borderColor = brandColors.primary.light,
  className = "",
  style = {},
}) => {
  const circleSizes = [size, size * 0.8, size * 0.6, size * 0.4].slice(0, circles);
  const circleOffsets = circleSizes.map((circleSize) => (size - circleSize) / 2);
  
  const animationDurations = [8, 10, 12, 15];
  const animationDelays = [0, 0.5, 1, 1.5];
  const electronDotSize = 10;

  return (
    <div 
      className={`absolute z-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      {circleSizes.map((circleSize, index) => {
        const radius = circleSize / 2;
        const electronRadius = radius - electronDotSize / 2;
        
        return (
          <React.Fragment key={index}>
            <div
              className="absolute"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: '50%',
                border: `1px solid ${borderColor}`,
                top: `${circleOffsets[index]}px`,
                left: `${circleOffsets[index]}px`,
                pointerEvents: 'none',
              }}
            />
            
            <div
              className="absolute electron-orbit-container"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                top: `${circleOffsets[index]}px`,
                left: `${circleOffsets[index]}px`,
                pointerEvents: 'none',
                animation: `electron-orbit ${animationDurations[index]}s linear infinite`,
                animationDelay: `${animationDelays[index]}s`,
              }}
            >
              <div
                className="bg-cem-primary"
                style={{
                  width: `${electronDotSize}px`,
                  height: `${electronDotSize}px`,
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -${electronRadius + electronDotSize / 2}px)`,
                }}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ConcentricCircles;

