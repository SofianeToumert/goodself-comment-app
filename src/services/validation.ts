export const COMMENT_MAX_LENGTH = 10000;
export const COMMENT_MIN_LENGTH = 1;
export const WARNING_THRESHOLD = 100;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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

export const getRemainingCharacters = (text: string): number =>
  COMMENT_MAX_LENGTH - text.length;

export const isNearLimit = (text: string): boolean =>
  getRemainingCharacters(text) < WARNING_THRESHOLD;

export const isOverLimit = (text: string): boolean =>
  text.length > COMMENT_MAX_LENGTH;
