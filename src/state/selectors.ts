import { useMemo } from 'react';
import type { CommentsState, CommentId, CommentNode } from '../types';

// Pure selector functions
export const selectCommentById = (
  state: CommentsState,
  id: CommentId
): CommentNode | undefined => state.byId[id];

export const selectRootComments = (state: CommentsState): CommentNode[] =>
  state.rootIds.map((id) => state.byId[id]).filter(Boolean);

export const selectChildComments = (
  state: CommentsState,
  parentId: CommentId
): CommentNode[] => {
  const parent = state.byId[parentId];
  if (!parent) return [];
  return parent.childIds.map((id) => state.byId[id]).filter(Boolean);
};

export const selectTotalCount = (state: CommentsState): number =>
  Object.keys(state.byId).length;

export const selectHasComments = (state: CommentsState): boolean =>
  state.rootIds.length > 0;

// Hook versions with memoization
export const useCommentById = (
  state: CommentsState,
  id: CommentId
): CommentNode | undefined => {
  const comment = state.byId[id];
  return useMemo(() => comment, [comment]);
};

export const useRootComments = (state: CommentsState): CommentNode[] =>
  useMemo(
    () => state.rootIds.map((id) => state.byId[id]).filter(Boolean),
    [state.rootIds, state.byId]
  );

export const useChildComments = (
  state: CommentsState,
  parentId: CommentId
): CommentNode[] =>
  useMemo(() => {
    const parent = state.byId[parentId];
    if (!parent) return [];
    return parent.childIds.map((id) => state.byId[id]).filter(Boolean);
  }, [state.byId, parentId]);

export const useTotalCount = (state: CommentsState): number =>
  useMemo(() => Object.keys(state.byId).length, [state.byId]);

export const useHasComments = (state: CommentsState): boolean =>
  useMemo(() => state.rootIds.length > 0, [state.rootIds]);
