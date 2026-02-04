/**
 * Storage service for persisting comments and user votes to localStorage.
 * Provides a centralized interface for all persistence operations.
 * @module services/storage
 */

import type { CommentsState, UserVotes } from '../types';
import { logger } from './logger';

/**
 * Storage keys used for localStorage persistence.
 * Namespaced to avoid collisions with other applications.
 */
export const STORAGE_KEYS = {
  /** Key for storing the comments state (byId and rootIds) */
  COMMENTS: 'goodself-comments-app:comments',
  /** Key for storing the user's vote history */
  USER_VOTES: 'goodself-comments-app:userVotes',
} as const;

/**
 * Default debounce delay for persisting state changes (in milliseconds).
 * Prevents excessive writes during rapid state updates.
 */
export const STORAGE_DEBOUNCE_MS = 300;

/**
 * Loads the comments state from localStorage.
 * Returns null if no data exists or if parsing fails.
 *
 * @returns The persisted comments state, or null if not found/invalid
 *
 * @example
 * ```ts
 * const savedState = loadComments();
 * if (savedState) {
 *   // Use saved state
 * } else {
 *   // Use initial state
 * }
 * ```
 */
export const loadComments = (): CommentsState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!data) {
      logger.debug('No comments found in localStorage');
      return null;
    }

    const parsed = JSON.parse(data) as CommentsState;

    // Basic validation to ensure structure is correct
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.byId !== 'object' ||
      !Array.isArray(parsed.rootIds)
    ) {
      logger.warn('Invalid comments structure in localStorage');
      return null;
    }

    logger.debug('Loaded comments from localStorage', {
      totalComments: Object.keys(parsed.byId).length,
      rootComments: parsed.rootIds.length,
    });

    return parsed;
  } catch (error) {
    logger.error(
      'Failed to load comments from localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
};

/**
 * Persists the comments state to localStorage.
 * Serializes the entire state including byId map and rootIds array.
 *
 * @param state - The comments state to persist
 *
 * @example
 * ```ts
 * // In a useEffect or debounced callback
 * saveComments(state);
 * ```
 */
export const saveComments = (state: CommentsState): void => {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, data);

    logger.debug('Saved comments to localStorage', {
      totalComments: Object.keys(state.byId).length,
      rootComments: state.rootIds.length,
    });
  } catch (error) {
    logger.error(
      'Failed to save comments to localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
};

/**
 * Loads the user's vote history from localStorage.
 * Returns null if no data exists or if parsing fails.
 *
 * @returns The persisted user votes, or null if not found/invalid
 *
 * @example
 * ```ts
 * const savedVotes = loadUserVotes();
 * const initialVotes = savedVotes ?? {};
 * ```
 */
export const loadUserVotes = (): UserVotes | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_VOTES);
    if (!data) {
      logger.debug('No user votes found in localStorage');
      return null;
    }

    const parsed = JSON.parse(data) as UserVotes;

    // Basic validation
    if (typeof parsed !== 'object' || parsed === null) {
      logger.warn('Invalid user votes structure in localStorage');
      return null;
    }

    logger.debug('Loaded user votes from localStorage', {
      totalVotes: Object.keys(parsed).length,
    });

    return parsed;
  } catch (error) {
    logger.error(
      'Failed to load user votes from localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
};

/**
 * Persists the user's vote history to localStorage.
 *
 * @param votes - The user votes to persist
 *
 * @example
 * ```ts
 * // After a vote action
 * saveUserVotes(votes);
 * ```
 */
export const saveUserVotes = (votes: UserVotes): void => {
  try {
    const data = JSON.stringify(votes);
    localStorage.setItem(STORAGE_KEYS.USER_VOTES, data);

    logger.debug('Saved user votes to localStorage', {
      totalVotes: Object.keys(votes).length,
    });
  } catch (error) {
    logger.error(
      'Failed to save user votes to localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
};

/**
 * Clears all persisted data from localStorage.
 * Useful for testing or implementing a "clear all data" feature.
 */
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.USER_VOTES);
    logger.debug('Cleared all storage');
  } catch (error) {
    logger.error(
      'Failed to clear storage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
};
