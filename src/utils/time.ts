/**
 * Time formatting utilities for displaying relative timestamps.
 * @module utils/time
 */

/**
 * Formats a timestamp into a human-readable relative time string.
 * Uses progressive units: just now, minutes, hours, days, then absolute date.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time string
 *
 * @example
 * ```ts
 * formatTime(Date.now() - 30000);    // 'just now'
 * formatTime(Date.now() - 300000);   // '5m ago'
 * formatTime(Date.now() - 3600000);  // '1h ago'
 * formatTime(Date.now() - 86400000); // '1d ago'
 * formatTime(Date.now() - 604800000); // '1/28/2024' (locale date)
 * ```
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
