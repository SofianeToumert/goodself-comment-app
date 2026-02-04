import type {
  CommentsState,
  AddCommentPayload,
  EditCommentPayload,
  DeleteCommentPayload,
  ToggleCollapsePayload,
  LikeCommentPayload,
  DislikeCommentPayload,
} from '../types';
import { createId, collectSubtreeIds } from '../utils';
import { initialState } from './reducer';

export const handleAddComment = (
  state: CommentsState,
  payload: AddCommentPayload
): CommentsState => {
  const { parentId, text } = payload;
  const id = createId();
  const now = Date.now();
  const newNode = {
    id,
    parentId,
    text,
    createdAt: now,
    childIds: [],
    likes: 0,
    dislikes: 0,
  };

  const newById = { ...state.byId, [id]: newNode };

  if (parentId === null) {
    return {
      byId: newById,
      rootIds: [...state.rootIds, id],
    };
  }

  const parent = state.byId[parentId];
  if (!parent) return state;

  return {
    byId: {
      ...newById,
      [parentId]: {
        ...parent,
        childIds: [...parent.childIds, id],
      },
    },
    rootIds: state.rootIds,
  };
};

export const handleEditComment = (
  state: CommentsState,
  payload: EditCommentPayload
): CommentsState => {
  const { id, text } = payload;
  const node = state.byId[id];
  if (!node) return state;

  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...node,
        text,
        updatedAt: Date.now(),
      },
    },
  };
};

export const handleDeleteComment = (
  state: CommentsState,
  payload: DeleteCommentPayload
): CommentsState => {
  const { id } = payload;
  const node = state.byId[id];
  if (!node) return state;

  const idsToDelete = collectSubtreeIds(id, state);
  const newById = { ...state.byId };
  for (const delId of idsToDelete) {
    delete newById[delId];
  }

  let newRootIds = state.rootIds;
  if (node.parentId === null) {
    newRootIds = state.rootIds.filter((rid) => rid !== id);
  } else {
    const parent = state.byId[node.parentId];
    if (parent) {
      newById[node.parentId] = {
        ...parent,
        childIds: parent.childIds.filter((cid) => cid !== id),
      };
    }
  }

  return {
    byId: newById,
    rootIds: newRootIds,
  };
};

export const handleToggleCollapse = (
  state: CommentsState,
  payload: ToggleCollapsePayload
): CommentsState => {
  const { id } = payload;
  const node = state.byId[id];
  if (!node) return state;

  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...node,
        isCollapsed: !node.isCollapsed,
      },
    },
  };
};

export const handleClearAll = (): CommentsState => {
  return initialState;
};

export const handleLikeComment = (
  state: CommentsState,
  payload: LikeCommentPayload
): CommentsState => {
  const { id, previousVote } = payload;
  const node = state.byId[id];
  if (!node) return state;

  let likes = node.likes ?? 0;
  let dislikes = node.dislikes ?? 0;

  if (previousVote === 'like') {
    // Toggle off
    likes--;
  } else if (previousVote === 'dislike') {
    // Switch from dislike to like
    likes++;
    dislikes--;
  } else {
    // New like
    likes++;
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...node,
        likes,
        dislikes,
      },
    },
  };
};

export const handleDislikeComment = (
  state: CommentsState,
  payload: DislikeCommentPayload
): CommentsState => {
  const { id, previousVote } = payload;
  const node = state.byId[id];
  if (!node) return state;

  let likes = node.likes ?? 0;
  let dislikes = node.dislikes ?? 0;

  if (previousVote === 'dislike') {
    // Toggle off
    dislikes--;
  } else if (previousVote === 'like') {
    // Switch from like to dislike
    dislikes++;
    likes--;
  } else {
    // New dislike
    dislikes++;
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...node,
        likes,
        dislikes,
      },
    },
  };
};

