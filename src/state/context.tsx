import {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { CommentsState, Action } from '../types';
import { commentsReducer, initialState } from './reducer';
import { logger } from '../services';

type CommentsContextValue = {
  state: CommentsState;
  dispatch: Dispatch<Action>;
};

export const CommentsContext = createContext<CommentsContextValue | null>(null);

type CommentsProviderProps = {
  children: ReactNode;
};

export const CommentsProvider = ({ children }: CommentsProviderProps) => {
  const [state, dispatch] = useReducer(commentsReducer, initialState);

  useEffect(() => {
    logger.debug('Comments state updated', {
      totalComments: Object.keys(state.byId).length,
      rootComments: state.rootIds.length,
    });
  }, [state]);

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
};
