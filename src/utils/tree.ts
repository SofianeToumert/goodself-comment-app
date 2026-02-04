/**
 * Tree traversal utilities for the comment hierarchy.
 * @module utils/tree
 */

import type { CommentId, CommentsState } from '../types';

/**
 * Recursively collects all IDs in a comment subtree.
 * Includes the root ID and all descendant IDs.
 * Used primarily for cascade delete operations.
 *
 * @param id - The root comment ID to start from
 * @param state - The current comments state
 * @returns Array of all comment IDs in the subtree (including root)
 *
 * @example
 * ```ts
 * // Get all IDs to delete (comment + all replies)
 * const idsToDelete = collectSubtreeIds(commentId, state);
 * idsToDelete.forEach(id => delete state.byId[id]);
 * ```
 */
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
