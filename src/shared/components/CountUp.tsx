"use client";

import React, { useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
}

/**
 * CountUp Component
 * Animación de números incrementales
 */
const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2, // Duración por defecto en segundos
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  decimal = ".",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const start = 0;

    // Si la duración es 0, mostrar directamente el valor final
    if (duration === 0) {
      setCount(end);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

      // Easing function (easeOutExpo) para un efecto suave al final
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const currentCount = start + (end - start) * easeOutExpo(progress);

      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  // Formatear el número
  const formatNumber = (num: number) => {
    // Asegurar que num es un número válido
    if (isNaN(num)) return "0";

    // Fijar decimales
    const fixed = num.toFixed(decimals);

    // Separar parte entera y decimal
    const [intPart, decPart] = fixed.split(".");

    // Añadir separador de miles
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    // Construir string final
    return `${prefix}${intFormatted}${decimals > 0 ? decimal + decPart : ""}${suffix}`;
  };

  return <span>{formatNumber(count)}</span>;
};

export default CountUp;
