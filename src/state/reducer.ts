import type { CommentsState, Action } from '../types';
import {
  handleAddComment,
  handleEditComment,
  handleDeleteComment,
  handleToggleCollapse,
  handleClearAll,
  handleLikeComment,
  handleDislikeComment,
} from './reducerHandlers';

export const initialState: CommentsState = {
  byId: {},
  rootIds: [],
};

export const commentsReducer = (
  state: CommentsState,
  action: Action
): CommentsState => {
  switch (action.type) {
    case 'ADD_COMMENT':
      return handleAddComment(state, action.payload);
    case 'EDIT_COMMENT':
      return handleEditComment(state, action.payload);
    case 'DELETE_COMMENT':
      return handleDeleteComment(state, action.payload);
    case 'TOGGLE_COLLAPSE':
      return handleToggleCollapse(state, action.payload);
    case 'CLEAR_ALL':
      return handleClearAll();
    case 'LIKE_COMMENT':
      return handleLikeComment(state, action.payload);
    case 'DISLIKE_COMMENT':
      return handleDislikeComment(state, action.payload);
    default:
      return state;
  }
};
