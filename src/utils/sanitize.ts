/**
 * Escapes HTML entities to prevent XSS attacks.
 * Always sanitize user input before rendering as HTML.
 */
export const sanitize = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * URL regex pattern that matches http/https URLs.
 * Captures common URL patterns while avoiding false positives.
 */
const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

/**
 * Converts URLs in text to safe anchor links.
 * Text is sanitized first, then URLs are converted to links.
 * Links open in new tab with security attributes.
 */
export const linkify = (text: string): string => {
  const sanitized = sanitize(text);
  return sanitized.replace(URL_REGEX, (url) => {
    // Decode any HTML entities in the URL that were created by sanitize
    const decodedUrl = url
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    // Re-sanitize for display text
    const displayUrl = sanitize(decodedUrl);

    return `<a href="${decodedUrl}" target="_blank" rel="noopener noreferrer">${displayUrl}</a>`;
  });
};
