import type { CommentId, CommentsState } from '../types';

export const collectSubtreeIds = (
  id: CommentId,
  state: CommentsState
): CommentId[] => {
  const ids: CommentId[] = [id];
  const node = state.byId[id];
  if (node) {
    for (const childId of node.childIds) {
      ids.push(...collectSubtreeIds(childId, state));
    }
  }
  return ids;
};
