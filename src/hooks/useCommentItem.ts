/**
 * Hook for managing individual comment item state and interactions.
 * Encapsulates all logic for a single comment including replies, editing,
 * deletion, and voting.
 * @module hooks/useCommentItem
 */

import { useState, useCallback, type KeyboardEvent } from 'react';
import { useComments } from './useComments';
import { useUserVotes } from './useUserVotes';
import { useFocusManagement } from './useFocusManagement';
import { useModal } from './useModal';
import type { CommentId, CommentNode, UserVote } from '../types';

/**
 * Return type for the useCommentItem hook.
 */
interface UseCommentItemReturn {
  /** The comment data from state */
  comment: CommentNode | undefined;
  /** The current user's vote on this comment */
  userVote: UserVote;
  /** Whether this comment has any child replies */
  hasChildren: boolean;
  /** Whether the reply form is currently shown */
  isReplying: boolean;
  /** Whether the comment is being edited */
  isEditing: boolean;
  /** Function to toggle the reply form visibility */
  setIsReplying: (value: boolean) => void;
  /** Function to toggle edit mode */
  setIsEditing: (value: boolean) => void;
  /** Handler for submitting a reply */
  handleReply: (text: string) => void;
  /** Handler for submitting an edit */
  handleEdit: (text: string) => void;
  /** Handler for initiating delete (shows confirmation modal) */
  handleDeleteClick: () => void;
  /** Handler for like action */
  handleLike: () => void;
  /** Handler for dislike action */
  handleDislike: () => void;
  /** Handler for keyboard shortcuts */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Handler for toggling child comments visibility */
  handleToggleCollapse: () => void;
}

/**
 * Hook for managing all interactions with a single comment item.
 * Combines comment operations, voting, modals, and focus management.
 *
 * @param id - The ID of the comment to manage
 * @returns Object containing comment state and interaction handlers
 *
 * @example
 * ```tsx
 * const {
 *   comment,
 *   userVote,
 *   isReplying,
 *   handleLike,
 *   handleReply,
 *   handleDeleteClick,
 * } = useCommentItem(commentId);
 *
 * if (!comment) return null;
 *
 * return (
 *   <div>
 *     <p>{comment.text}</p>
 *     <button onClick={handleLike}>Like ({comment.likes})</button>
 *   </div>
 * );
 * ```
 */
export const useCommentItem = (id: CommentId): UseCommentItemReturn => {
  const {
    state,
    editComment,
    deleteComment,
    toggleCollapse,
    addComment,
    likeComment,
    dislikeComment,
  } = useComments();
  const { getVote, setVote } = useUserVotes();
  const { saveFocus, restoreFocus } = useFocusManagement();
  const { openModal } = useModal();

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const comment = state.byId[id];
  const userVote = getVote(id);
  const hasChildren = comment ? comment.childIds.length > 0 : false;

  const handleReply = useCallback(
    (text: string) => {
      addComment(id, text);
      setIsReplying(false);
    },
    [addComment, id]
  );

  const handleEdit = useCallback(
    (text: string) => {
      editComment(id, text);
      setIsEditing(false);
    },
    [editComment, id]
  );

  const handleDeleteClick = useCallback(() => {
    saveFocus();
    openModal({
      title: 'Delete Comment',
      message:
        'Are you sure you want to delete this comment and all its replies? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        deleteComment(id);
        restoreFocus();
      },
    });
  }, [saveFocus, openModal, deleteComment, id, restoreFocus]);

  const handleLike = useCallback(() => {
    likeComment(id, userVote);
    setVote(id, userVote === 'like' ? null : 'like');
  }, [likeComment, id, userVote, setVote]);

  const handleDislike = useCallback(() => {
    dislikeComment(id, userVote);
    setVote(id, userVote === 'dislike' ? null : 'dislike');
  }, [dislikeComment, id, userVote, setVote]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isEditing && !isReplying) {
        e.preventDefault();
        e.stopPropagation();
        setIsReplying(true);
      }
    },
    [isEditing, isReplying]
  );

  const handleToggleCollapse = useCallback(() => {
    toggleCollapse(id);
  }, [toggleCollapse, id]);

  return {
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
  };
};
