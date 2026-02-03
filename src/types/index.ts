export type CommentId = string;

export type CommentNode = {
  id: CommentId;
  parentId: CommentId | null;
  text: string;
  createdAt: number;
  updatedAt?: number;
  childIds: CommentId[];
  isCollapsed?: boolean;
};

export type CommentsState = {
  byId: Record<CommentId, CommentNode>;
  rootIds: CommentId[];
};

export type AddCommentPayload = {
  parentId: CommentId | null;
  text: string;
};

export type EditCommentPayload = {
  id: CommentId;
  text: string;
};

export type DeleteCommentPayload = {
  id: CommentId;
};

export type ToggleCollapsePayload = {
  id: CommentId;
};

export type Action =
  | { type: 'ADD_COMMENT'; payload: AddCommentPayload }
  | { type: 'EDIT_COMMENT'; payload: EditCommentPayload }
  | { type: 'DELETE_COMMENT'; payload: DeleteCommentPayload }
  | { type: 'TOGGLE_COLLAPSE'; payload: ToggleCollapsePayload }
  | { type: 'CLEAR_ALL' }
  | { type: 'HYDRATE'; payload: CommentsState };
