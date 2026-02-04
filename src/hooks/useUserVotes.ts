import { useState, useCallback, useEffect } from 'react';
import type { CommentId, UserVote, UserVotes } from '../types';

const STORAGE_KEY = 'goodself_user_votes_v1';

const loadVotes = (): UserVotes => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveVotes = (votes: UserVotes): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Ignore storage errors
  }
};

export const useUserVotes = () => {
  const [votes, setVotes] = useState<UserVotes>(loadVotes);

  useEffect(() => {
    saveVotes(votes);
  }, [votes]);

  const getVote = useCallback(
    (commentId: CommentId): UserVote => {
      return votes[commentId] ?? null;
    },
    [votes]
  );

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
