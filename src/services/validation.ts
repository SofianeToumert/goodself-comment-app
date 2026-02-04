/**
 * Validation utilities for comment text input.
 * Provides length validation and character counting.
 * @module services/validation
 */

/** Maximum allowed characters for a comment */
export const COMMENT_MAX_LENGTH = 10000;

/** Minimum required characters for a comment (after trimming) */
export const COMMENT_MIN_LENGTH = 1;

/** Number of remaining characters at which to show a warning */
export const WARNING_THRESHOLD = 100;

/**
 * Result of a validation check.
 */
interface ValidationResult {
  /** Whether the text passes all validation rules */
  isValid: boolean;
  /** Array of error messages for failed rules */
  errors: string[];
}

/**
 * Validates comment text against length requirements.
 * Checks both minimum (non-empty) and maximum length.
 *
 * @param text - The comment text to validate
 * @returns Validation result with isValid flag and error messages
 *
 * @example
 * ```ts
 * const { isValid, errors } = validateCommentText(userInput);
 * if (!isValid) {
 *   console.log('Validation errors:', errors);
 * }
 * ```
 */
export const validateCommentText = (text: string): ValidationResult => {
  const trimmed = text.trim();
  const errors: string[] = [];

  if (trimmed.length < COMMENT_MIN_LENGTH) {
    errors.push('Comment cannot be empty');
  }

  if (trimmed.length > COMMENT_MAX_LENGTH) {
    errors.push(`Comment cannot exceed ${COMMENT_MAX_LENGTH.toLocaleString()} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculates the number of characters remaining before the limit.
 * Can return negative values if over the limit.
 *
 * @param text - The current text content
 * @returns Number of characters remaining (negative if over limit)
 */
export const getRemainingCharacters = (text: string): number =>
  COMMENT_MAX_LENGTH - text.length;

/**
 * Checks if the text is approaching the character limit.
 * Returns true when within WARNING_THRESHOLD characters of the limit.
 *
 * @param text - The current text content
 * @returns Whether the warning should be displayed
 */
export const isNearLimit = (text: string): boolean =>
  getRemainingCharacters(text) < WARNING_THRESHOLD;

/**
 * Checks if the text exceeds the character limit.
 *
 * @param text - The current text content
 * @returns Whether the text is over the limit
 */
export const isOverLimit = (text: string): boolean =>
  text.length > COMMENT_MAX_LENGTH;
