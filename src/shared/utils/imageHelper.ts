/**
 * Helper function to get the correct image URL from imported images
 * Handles both string URLs and module imports that may return objects
 */
export const getImageUrl = (image: string | { default?: string; src?: string } | any): string => {
  if (!image) return '';
  
  // If it's already a string, return it (but validate it's a valid URL or path)
  if (typeof image === 'string') {
    // If it's a valid URL (http/https) or starts with /, return as is
    if (image.startsWith('http') || image.startsWith('/') || image.startsWith('./') || image.startsWith('../')) {
      return image;
    }
    // If it looks like a data URL, return it
    if (image.startsWith('data:')) {
      return image;
    }
    // Otherwise, it might be a path that needs to be resolved
    return image;
  }
  
  // If it's an object with default property (common in Next.js)
  if (image && typeof image === 'object') {
    // Check for default property
    if (image.default !== undefined) {
      const defaultValue = image.default;
      if (typeof defaultValue === 'string') {
        return defaultValue;
      }
      if (defaultValue && typeof defaultValue === 'object' && defaultValue.src) {
        return defaultValue.src;
      }
    }
    // Check for src property
    if (image.src && typeof image.src === 'string') {
      return image.src;
    }
    // Check if it's a URL object
    if (image.href && typeof image.href === 'string') {
      return image.href;
    }
  }
  
  // Fallback: try to convert to string, but log a warning
  const result = String(image);
  if (result === '[object Object]') {
    console.warn('getImageUrl: Received an object that could not be converted to a string:', image);
    return '';
  }
  
  return result;
};

