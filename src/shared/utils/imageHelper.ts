/**
 * Helper function to get the correct image URL from imported images
 * Handles both string URLs and module imports that may return objects
 */
export const getImageUrl = (image: string | { default?: string; src?: string } | unknown): string => {
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
    const imageObj = image as Record<string, unknown>;
    // Check for default property
    if (imageObj.default !== undefined) {
      const defaultValue = imageObj.default;
      if (typeof defaultValue === 'string') {
        return defaultValue;
      }
      if (defaultValue && typeof defaultValue === 'object') {
        const defaultValueObj = defaultValue as Record<string, unknown>;
        if (defaultValueObj.src && typeof defaultValueObj.src === 'string') {
          return defaultValueObj.src;
        }
      }
    }
    // Check for src property
    if (imageObj.src && typeof imageObj.src === 'string') {
      return imageObj.src;
    }
    // Check if it's a URL object
    if (imageObj.href && typeof imageObj.href === 'string') {
      return imageObj.href;
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

