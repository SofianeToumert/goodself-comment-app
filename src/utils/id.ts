import type { CommentId } from '../types';

export const createId = (): CommentId => {
  return crypto.randomUUID();
};
