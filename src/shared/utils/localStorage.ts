/**
 * Helper function to safely access localStorage
 * Returns null if running on server-side (SSR)
 */
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
};

/**
 * Helper function to safely set localStorage
 * Only works on client-side
 */
export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

/**
 * Helper function to safely remove from localStorage
 * Only works on client-side
 */
export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

