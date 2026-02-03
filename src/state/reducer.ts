import type { CommentsState, Action } from '../types';
import { createId, collectSubtreeIds } from '../utils';

export const initialState: CommentsState = {
  byId: {},
  rootIds: [],
};

export const commentsReducer = (
  state: CommentsState,
  action: Action
): CommentsState => {
  switch (action.type) {
    case 'ADD_COMMENT': {
      const { parentId, text } = action.payload;
      const id = createId();
      const now = Date.now();
      const newNode = {
        id,
        parentId,
        text,
        createdAt: now,
        childIds: [],
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
    }

    case 'EDIT_COMMENT': {
      const { id, text } = action.payload;
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
    }

    case 'DELETE_COMMENT': {
      const { id } = action.payload;
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
    }

    case 'TOGGLE_COLLAPSE': {
      const { id } = action.payload;
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
    }

    case 'CLEAR_ALL': {
      return initialState;
    }

    case 'HYDRATE': {
      return action.payload;
    }

    default:
      return state;
  }
};
