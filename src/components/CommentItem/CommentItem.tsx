import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useComments } from '../../hooks';
import { CommentForm } from '../CommentForm';
import { CommentContent } from './CommentContent';
import { CommentActions } from './CommentActions';
import { CommentChildren } from './CommentChildren';
import type { CommentId } from '../../types';
import styles from './CommentItem.module.css';

type CommentItemProps = {
  id: CommentId;
  depth?: number;
};

export const CommentItem = ({ id, depth = 0 }: CommentItemProps) => {
  const { state, editComment, deleteComment, toggleCollapse, addComment } =
    useComments();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const comment = state.byId[id];
  if (!comment) return null;

  const hasChildren = comment.childIds.length > 0;

  const handleReply = (text: string) => {
    addComment(id, text);
    setIsReplying(false);
  };

  const handleEdit = (text: string) => {
    editComment(id, text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this comment and all replies?')) {
      deleteComment(id);
    }
  };

  return (
    <div className={styles.item} style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      <div className={styles.content}>
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
              text={comment.text}
              createdAt={comment.createdAt}
              isEdited={!!comment.updatedAt}
            />
            <CommentActions
              isReplying={isReplying}
              hasChildren={hasChildren}
              isCollapsed={!!comment.isCollapsed}
              onReplyClick={() => setIsReplying(!isReplying)}
              onEditClick={() => setIsEditing(true)}
              onDeleteClick={handleDelete}
              onCollapseClick={() => toggleCollapse(id)}
            />
          </>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isReplying && (
          <motion.div
            className={styles.replyForm}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <CommentForm
              placeholder="Write a reply..."
              submitLabel="Reply"
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CommentChildren
        childIds={comment.childIds}
        isCollapsed={!!comment.isCollapsed}
        depth={depth}
      />
    </div>
  );
};
