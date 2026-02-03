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
      <button
        type="button"
        className={styles.actionButton}
        onClick={onReplyClick}
      >
        {isReplying ? 'Cancel' : 'Reply'}
      </button>
      <button
        type="button"
        className={styles.actionButton}
        onClick={onEditClick}
      >
        Edit
      </button>
      <button
        type="button"
        className={styles.actionButton}
        onClick={onDeleteClick}
      >
        Delete
      </button>
      {hasChildren && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={onCollapseClick}
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      )}
    </div>
  );
};
