import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import styles from './CommentItem.module.css';

type VoteButtonProps = {
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  onClick: () => void;
  label: string;
};

export const VoteButton = ({
  icon: Icon,
  count,
  isActive,
  onClick,
  label,
}: VoteButtonProps) => {
  return (
    <motion.button
      type="button"
      className={`${styles.voteButton} ${isActive ? styles.voteActive : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={`${label} (${count})`}
      aria-pressed={isActive}
      title={label}
    >
      <Icon size={16} />
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          className={styles.voteCount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};
