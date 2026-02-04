import { useState, useCallback, useRef } from 'react';
import type { CommentId, UserVote, UserVotes } from '../types';
import {
  loadUserVotes,
  saveUserVotes,
  STORAGE_DEBOUNCE_MS,
} from '../services';
import { useDebouncedEffect } from './useDebouncedEffect';

/**
 * Initializes user votes from localStorage.
 * Returns an empty object if no persisted votes exist.
 *
 * @returns The persisted votes or an empty object
 */
const initializeVotes = (): UserVotes => {
  return loadUserVotes() ?? {};
};

/**
 * Hook for managing user vote state (likes/dislikes) per comment.
 * Persists votes to localStorage with debouncing.
 *
 * @returns Object containing getVote and setVote functions
 *
 * @example
 * ```tsx
 * const { getVote, setVote } = useUserVotes();
 *
 * // Get current vote for a comment
 * const vote = getVote(commentId); // 'like' | 'dislike' | null
 *
 * // Set or toggle a vote
 * setVote(commentId, 'like');    // Like the comment
 * setVote(commentId, null);       // Remove the vote
 * ```
 */
export const useUserVotes = () => {
  const [votes, setVotes] = useState<UserVotes>(initializeVotes);
  const isInitialMount = useRef(true);

  // Persist votes to localStorage with debouncing
  useDebouncedEffect(
    () => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      saveUserVotes(votes);
    },
    [votes],
    STORAGE_DEBOUNCE_MS
  );

  /**
   * Gets the current vote for a specific comment.
   *
   * @param commentId - The ID of the comment to get the vote for
   * @returns The user's vote ('like' | 'dislike') or null if not voted
   */
  const getVote = useCallback(
    (commentId: CommentId): UserVote => {
      return votes[commentId] ?? null;
    },
    [votes]
  );

  /**
   * Sets or removes a vote for a specific comment.
   *
   * @param commentId - The ID of the comment to vote on
   * @param vote - The vote to set ('like' | 'dislike') or null to remove
   */
  const setVote = useCallback((commentId: CommentId, vote: UserVote) => {
    setVotes((prev) => {
      const next = { ...prev };
      if (vote === null) {
        delete next[commentId];
      } else {
        next[commentId] = vote;
      }
      return next;
    });
  }, []);

  return { getVote, setVote };
};
