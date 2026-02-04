import { useState, useCallback, type KeyboardEvent } from 'react';
import { useComments } from './useComments';
import { useUserVotes } from './useUserVotes';
import { useFocusManagement } from './useFocusManagement';
import { useModal } from './useModal';
import type { CommentId, CommentNode, UserVote } from '../types';

interface UseCommentItemReturn {
  // Derived state
  comment: CommentNode | undefined;
  userVote: UserVote;
  hasChildren: boolean;

  // Local UI state
  isReplying: boolean;
  isEditing: boolean;
  setIsReplying: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;

  // Event handlers
  handleReply: (text: string) => void;
  handleEdit: (text: string) => void;
  handleDeleteClick: () => void;
  handleLike: () => void;
  handleDislike: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleToggleCollapse: () => void;
}

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
