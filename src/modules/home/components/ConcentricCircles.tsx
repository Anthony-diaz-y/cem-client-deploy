import React from "react";
import { brandColors } from "@shared/design-tokens";

interface ConcentricCirclesProps {
  size?: number;
  circles?: number;
  borderColor?: string;
  dotColor?: string;
  showDot?: boolean;
  dotSize?: number;
  className?: string;
  dotClassName?: string;
  style?: React.CSSProperties;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  size = 400,
  circles = 4,
  borderColor = brandColors.primary.light,
  dotColor = brandColors.primary.light,
  showDot = true,
  dotSize = 16,
  className = "",
  dotClassName = "",
  style = {},
}) => {
  const circleSizes = [size, size * 0.8, size * 0.6, size * 0.4].slice(0, circles);
  const circleOffsets = circleSizes.map((circleSize) => (size - circleSize) / 2);

  return (
    <div 
      className={`absolute z-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      {circleSizes.map((circleSize, index) => (
        <div
          key={index}
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
      ))}

      {showDot && (
        <div
          className={`absolute ${dotClassName}`}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            minWidth: `${dotSize}px`,
            minHeight: `${dotSize}px`,
            maxWidth: `${dotSize}px`,
            maxHeight: `${dotSize}px`,
            borderRadius: '50%',
            backgroundColor: dotColor,
            ...(dotClassName ? {} : { top: '8px', left: '8px' }),
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default ConcentricCircles;

