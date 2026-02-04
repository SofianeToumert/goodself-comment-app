import {
  createContext,
  useReducer,
  useRef,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { CommentsState, Action } from '../types';
import { commentsReducer, initialState } from './reducer';
import {
  logger,
  loadComments,
  saveComments,
  STORAGE_DEBOUNCE_MS,
} from '../services';
import { useDebouncedEffect } from '../hooks/useDebouncedEffect';

/**
 * Context value providing access to comments state and dispatch function.
 */
type CommentsContextValue = {
  state: CommentsState;
  dispatch: Dispatch<Action>;
};

export const CommentsContext = createContext<CommentsContextValue | null>(null);

type CommentsProviderProps = {
  children: ReactNode;
};

/**
 * Initializer function for useReducer that loads persisted state from localStorage.
 * Falls back to initial state if no persisted data exists.
 *
 * @param defaultState - The default initial state to use as fallback
 * @returns The persisted state or default state
 */
const initializeState = (defaultState: CommentsState): CommentsState => {
  const persistedState = loadComments();
  if (persistedState) {
    logger.info('Restored comments from localStorage', {
      totalComments: Object.keys(persistedState.byId).length,
      rootComments: persistedState.rootIds.length,
    });
    return persistedState;
  }
  return defaultState;
};

/**
 * Provider component for the comments context.
 * Initializes state from localStorage and persists changes with debouncing.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the provider
 */
export const CommentsProvider = ({ children }: CommentsProviderProps) => {
  const [state, dispatch] = useReducer(commentsReducer, initialState, initializeState);
  const isInitialMount = useRef(true);

  // Persist state changes to localStorage with debouncing
  // Skip the initial mount to avoid unnecessary write on load
  useDebouncedEffect(
    () => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      saveComments(state);
      logger.debug('Comments state persisted', {
        totalComments: Object.keys(state.byId).length,
        rootComments: state.rootIds.length,
      });
    },
    [state],
    STORAGE_DEBOUNCE_MS
  );

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
};
