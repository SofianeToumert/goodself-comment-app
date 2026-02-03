import { useContext, useCallback } from 'react';
import { CommentsContext } from '../state';
import type { CommentId } from '../types';

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within CommentsProvider');
  }

  const { state, dispatch } = context;

  const addComment = useCallback(
    (parentId: CommentId | null, text: string) => {
      dispatch({ type: 'ADD_COMMENT', payload: { parentId, text } });
    },
    [dispatch]
  );

  const editComment = useCallback(
    (id: CommentId, text: string) => {
      dispatch({ type: 'EDIT_COMMENT', payload: { id, text } });
    },
    [dispatch]
  );

  const deleteComment = useCallback(
    (id: CommentId) => {
      dispatch({ type: 'DELETE_COMMENT', payload: { id } });
    },
    [dispatch]
  );

  const toggleCollapse = useCallback(
    (id: CommentId) => {
      dispatch({ type: 'TOGGLE_COLLAPSE', payload: { id } });
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, [dispatch]);

  return {
    state,
    addComment,
    editComment,
    deleteComment,
    toggleCollapse,
    clearAll,
  };
};
