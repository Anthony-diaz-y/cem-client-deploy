import { useEffect, useRef } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
  callback: (value: T) => void,
  skipFirst?: boolean
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<T | null>(null);
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (skipFirst && isFirstRef.current) {
      isFirstRef.current = false;
      lastValueRef.current = value;
      return;
    }

    if (lastValueRef.current === value) {
      return;
    }

    lastValueRef.current = value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, callback, skipFirst]);
}


