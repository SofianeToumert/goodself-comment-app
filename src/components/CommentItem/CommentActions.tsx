import { motion } from 'framer-motion';
import { Reply, X, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './CommentItem.module.css';

type CommentActionsProps = {
  isReplying: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onReplyClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCollapseClick: () => void;
};

const buttonVariants = {
  tap: { scale: 0.9 },
  hover: { scale: 1.1 },
};

export const CommentActions = ({
  isReplying,
  hasChildren,
  isCollapsed,
  onReplyClick,
  onEditClick,
  onDeleteClick,
  onCollapseClick,
}: CommentActionsProps) => {
  return (
    <div className={styles.actions}>
      <motion.button
        type="button"
        className={styles.iconButton}
        onClick={onReplyClick}
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        aria-label={isReplying ? 'Cancel reply' : 'Reply'}
        title={isReplying ? 'Cancel' : 'Reply'}
      >
        {isReplying ? <X size={16} /> : <Reply size={16} />}
      </motion.button>

      <motion.button
        type="button"
        className={styles.iconButton}
        onClick={onEditClick}
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        aria-label="Edit"
        title="Edit"
      >
        <Pencil size={16} />
      </motion.button>

      <motion.button
        type="button"
        className={`${styles.iconButton} ${styles.deleteButton}`}
        onClick={onDeleteClick}
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        aria-label="Delete"
        title="Delete"
      >
        <Trash2 size={16} />
      </motion.button>

      {hasChildren && (
        <motion.button
          type="button"
          className={styles.iconButton}
          onClick={onCollapseClick}
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          aria-label={isCollapsed ? 'Expand replies' : 'Collapse replies'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </motion.button>
      )}
    </div>
  );
};
