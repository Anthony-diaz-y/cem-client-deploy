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

const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2,
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

    if (duration === 0) {
      setCount(end);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

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

  const formatNumber = (num: number) => {
    if (isNaN(num)) return "0";

    const fixed = num.toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return `${prefix}${intFormatted}${decimals > 0 ? decimal + decPart : ""}${suffix}`;
  };

  return <span>{formatNumber(count)}</span>;
};

export default CountUp;

