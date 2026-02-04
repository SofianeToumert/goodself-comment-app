import { memo } from 'react';
import { Reply, X, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { MotionIconButton } from '../shared';
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

export const CommentActions = memo(function CommentActions({
  isReplying,
  hasChildren,
  isCollapsed,
  onReplyClick,
  onEditClick,
  onDeleteClick,
  onCollapseClick,
}: CommentActionsProps) {
  return (
    <div className={styles.actions} role="group" aria-label="Comment actions">
      <MotionIconButton
        className={styles.iconButton}
        onClick={onReplyClick}
        label={isReplying ? 'Cancel reply' : 'Reply to this comment'}
        pressed={isReplying}
      >
        {isReplying ? <X size={16} aria-hidden="true" /> : <Reply size={16} aria-hidden="true" />}
      </MotionIconButton>

      <MotionIconButton
        className={styles.iconButton}
        onClick={onEditClick}
        label="Edit this comment"
      >
        <Pencil size={16} aria-hidden="true" />
      </MotionIconButton>

      <MotionIconButton
        className={`${styles.iconButton} ${styles.deleteButton}`}
        onClick={onDeleteClick}
        label="Delete this comment"
      >
        <Trash2 size={16} aria-hidden="true" />
      </MotionIconButton>

      {hasChildren && (
        <MotionIconButton
          className={styles.iconButton}
          onClick={onCollapseClick}
          label={isCollapsed ? 'Expand replies' : 'Collapse replies'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ChevronDown size={16} aria-hidden="true" />
          ) : (
            <ChevronUp size={16} aria-hidden="true" />
          )}
        </MotionIconButton>
      )}
    </div>
  );
});
