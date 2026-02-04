import { useState, useCallback } from 'react';
import type { CommentId, UserVote, UserVotes } from '../types';

export const useUserVotes = () => {
  const [votes, setVotes] = useState<UserVotes>({});

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
