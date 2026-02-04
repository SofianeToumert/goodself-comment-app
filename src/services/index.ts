export { logger } from './logger';
export type { LogLevel, LogEntry, LogTransport } from './logger';

export {
  validateCommentText,
  getRemainingCharacters,
  isNearLimit,
  isOverLimit,
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  WARNING_THRESHOLD,
} from './validation';

export {
  STORAGE_KEYS,
  STORAGE_DEBOUNCE_MS,
  loadComments,
  saveComments,
  loadUserVotes,
  saveUserVotes,
  clearStorage,
} from './storage';
