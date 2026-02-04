/**
 * XSS prevention utilities for sanitizing user input.
 * Provides HTML entity escaping and safe URL linkification.
 * @module utils/sanitize
 */

/**
 * Escapes HTML entities to prevent XSS attacks.
 * Converts dangerous characters to their HTML entity equivalents.
 * Always sanitize user input before rendering as HTML.
 *
 * @param text - The raw text to sanitize
 * @returns Text with HTML entities escaped
 *
 * @example
 * ```ts
 * sanitize('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
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
 * Stops at whitespace and common URL terminators.
 */
const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

/**
 * Converts URLs in text to safe, clickable anchor links.
 * Text is sanitized first to prevent XSS, then URLs are converted.
 * Links include security attributes (noopener, noreferrer) and open in new tabs.
 *
 * @param text - The raw text that may contain URLs
 * @returns HTML string with URLs converted to anchor tags
 *
 * @example
 * ```ts
 * linkify('Check out https://example.com for more info')
 * // Returns: 'Check out <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a> for more info'
 * ```
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
