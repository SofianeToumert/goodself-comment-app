import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { MotionIconButton } from '../shared';
import styles from './CommentItem.module.css';

type VoteButtonProps = {
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  onClick: () => void;
  label: string;
  variant?: 'like' | 'dislike';
};

export const VoteButton = memo(function VoteButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  label,
  variant = 'like',
}: VoteButtonProps) {
  const activeClass = variant === 'dislike' ? styles.voteActiveDislike : styles.voteActive;
  return (
    <MotionIconButton
      className={`${styles.voteButton} ${isActive ? activeClass : ''}`}
      onClick={onClick}
      hoverScale={1.05}
      label={`${label} this comment. Current ${label.toLowerCase()}s: ${count}`}
      pressed={isActive}
    >
      <Icon size={16} aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          className={styles.voteCount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          aria-hidden="true"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </MotionIconButton>
  );
});
