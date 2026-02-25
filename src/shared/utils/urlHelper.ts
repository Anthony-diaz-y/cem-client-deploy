/**
 * Checks if a string is a valid URL and ensures it has a protocol.
 * If the string starts with www. or directly with a domain, prepends https://.
 */
export const ensureFullUrl = (url: string | null | undefined): string => {
    if (!url) return "#";

    const trimmedUrl = url.trim();
    if (trimmedUrl === "" || trimmedUrl === "#") return "#";

    // If it already has a protocol, return as is
    if (/^https?:\/\//i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    // Prepend https://
    return `https://${trimmedUrl}`;
};
