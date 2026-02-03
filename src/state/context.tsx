import {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { CommentsState, Action } from '../types';
import { commentsReducer, initialState } from './reducer';
import { STORAGE_KEY } from '../constants';

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

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CommentsState;
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {
      // Invalid data, start fresh
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable
    }
  }, [state]);

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
};
