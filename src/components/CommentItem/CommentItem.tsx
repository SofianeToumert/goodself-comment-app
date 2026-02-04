import { memo } from 'react';
import { useCommentItem } from '../../hooks';
import { CommentForm } from '../CommentForm';
import { CommentContent } from './CommentContent';
import { CommentActions } from './CommentActions';
import { LikeDislikeButtons } from './LikeDislikeButtons';
import { CommentChildren } from './CommentChildren';
import { ReplyFormSection } from './ReplyFormSection';
import type { CommentId } from '../../types';
import styles from './CommentItem.module.css';

type CommentItemProps = {
  id: CommentId;
  depth?: number;
};

export const CommentItem = memo(function CommentItem({
  id,
  depth = 0,
}: CommentItemProps) {
  const {
    comment,
    userVote,
    hasChildren,
    isReplying,
    isEditing,
    setIsReplying,
    setIsEditing,
    handleReply,
    handleEdit,
    handleDeleteClick,
    handleLike,
    handleDislike,
    handleKeyDown,
    handleToggleCollapse,
  } = useCommentItem(id);

  if (!comment) return null;

  return (
    <article
      className={styles.item}
      style={{ marginLeft: depth > 0 ? 24 : 0 }}
      role="article"
      aria-labelledby={`comment-${id}-content`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.content}
        aria-expanded={hasChildren ? !comment.isCollapsed : undefined}
        aria-controls={hasChildren ? `comment-${id}-children` : undefined}
      >
        {isEditing ? (
          <CommentForm
            initialText={comment.text}
            submitLabel="Save"
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <>
            <CommentContent
              id={`comment-${id}-content`}
              text={comment.text}
              createdAt={comment.createdAt}
              isEdited={!!comment.updatedAt}
            />
            <div className={styles.actionsRow}>
              <LikeDislikeButtons
                likes={comment.likes ?? 0}
                dislikes={comment.dislikes ?? 0}
                userVote={userVote}
                onLike={handleLike}
                onDislike={handleDislike}
              />
              <CommentActions
                isReplying={isReplying}
                hasChildren={hasChildren}
                isCollapsed={!!comment.isCollapsed}
                onReplyClick={() => setIsReplying(!isReplying)}
                onEditClick={() => setIsEditing(true)}
                onDeleteClick={handleDeleteClick}
                onCollapseClick={handleToggleCollapse}
              />
            </div>
          </>
        )}
      </div>

      <ReplyFormSection
        isVisible={isReplying}
        onSubmit={handleReply}
        onCancel={() => setIsReplying(false)}
      />

      {hasChildren && (
        <div id={`comment-${id}-children`} role="group" aria-label="Replies">
          <CommentChildren
            childIds={comment.childIds}
            isCollapsed={!!comment.isCollapsed}
            depth={depth}
          />
        </div>
      )}
    </article>
  );
});
