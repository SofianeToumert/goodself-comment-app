import { memo } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { UserVote } from '../../types';
import { VoteButton } from './VoteButton';
import styles from './CommentItem.module.css';

type LikeDislikeButtonsProps = {
  likes: number;
  dislikes: number;
  userVote: UserVote;
  onLike: () => void;
  onDislike: () => void;
};

export const LikeDislikeButtons = memo(function LikeDislikeButtons({
  likes,
  dislikes,
  userVote,
  onLike,
  onDislike,
}: LikeDislikeButtonsProps) {
  return (
    <div className={styles.voteButtons} role="group" aria-label="Vote on this comment">
      <VoteButton
        icon={ThumbsUp}
        count={likes}
        isActive={userVote === 'like'}
        onClick={onLike}
        label="Like"
      />
      <VoteButton
        icon={ThumbsDown}
        count={dislikes}
        isActive={userVote === 'dislike'}
        onClick={onDislike}
        label="Dislike"
      />
    </div>
  );
});
