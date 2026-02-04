/**
 * Hook for accessing and manipulating comments state.
 * Provides CRUD operations and voting functionality for comments.
 * @module hooks/useComments
 */

import { useContext, useCallback } from 'react';
import { CommentsContext } from '../state';
import type { CommentId, UserVote } from '../types';

/**
 * Hook for managing comments within the application.
 * Must be used within a CommentsProvider component.
 *
 * @returns Object containing state and action functions for comment operations
 * @throws {Error} If used outside of CommentsProvider
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   addComment,
 *   editComment,
 *   deleteComment,
 *   likeComment,
 *   dislikeComment,
 * } = useComments();
 *
 * // Add a root comment
 * addComment(null, 'Hello world!');
 *
 * // Add a reply
 * addComment(parentId, 'This is a reply');
 *
 * // Edit a comment
 * editComment(commentId, 'Updated text');
 * ```
 */
export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within CommentsProvider');
  }

  const { state, dispatch } = context;

  /**
   * Adds a new comment to the tree.
   *
   * @param parentId - ID of the parent comment, or null for root comments
   * @param text - The comment text content
   */
  const addComment = useCallback(
    (parentId: CommentId | null, text: string) => {
      dispatch({ type: 'ADD_COMMENT', payload: { parentId, text } });
    },
    [dispatch]
  );

  /**
   * Updates an existing comment's text.
   *
   * @param id - ID of the comment to edit
   * @param text - The new text content
   */
  const editComment = useCallback(
    (id: CommentId, text: string) => {
      dispatch({ type: 'EDIT_COMMENT', payload: { id, text } });
    },
    [dispatch]
  );

  /**
   * Deletes a comment and all its descendants.
   *
   * @param id - ID of the comment to delete
   */
  const deleteComment = useCallback(
    (id: CommentId) => {
      dispatch({ type: 'DELETE_COMMENT', payload: { id } });
    },
    [dispatch]
  );

  /**
   * Toggles the collapsed state of a comment's children.
   *
   * @param id - ID of the comment to toggle
   */
  const toggleCollapse = useCallback(
    (id: CommentId) => {
      dispatch({ type: 'TOGGLE_COLLAPSE', payload: { id } });
    },
    [dispatch]
  );

  /**
   * Clears all comments from the state.
   */
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, [dispatch]);

  /**
   * Handles a like action on a comment.
   * Adjusts counts based on the user's previous vote.
   *
   * @param id - ID of the comment to like
   * @param previousVote - The user's previous vote on this comment
   */
  const likeComment = useCallback(
    (id: CommentId, previousVote: UserVote) => {
      dispatch({ type: 'LIKE_COMMENT', payload: { id, previousVote } });
    },
    [dispatch]
  );

  /**
   * Handles a dislike action on a comment.
   * Adjusts counts based on the user's previous vote.
   *
   * @param id - ID of the comment to dislike
   * @param previousVote - The user's previous vote on this comment
   */
  const dislikeComment = useCallback(
    (id: CommentId, previousVote: UserVote) => {
      dispatch({ type: 'DISLIKE_COMMENT', payload: { id, previousVote } });
    },
    [dispatch]
  );

  return {
    state,
    addComment,
    editComment,
    deleteComment,
    toggleCollapse,
    clearAll,
    likeComment,
    dislikeComment,
  };
};
