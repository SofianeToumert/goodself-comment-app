import { useRef, useCallback } from 'react';

interface UseFocusManagementReturn {
  saveFocus: () => void;
  restoreFocus: () => void;
  focusElement: (element: HTMLElement | null) => void;
}

export const useFocusManagement = (): UseFocusManagementReturn => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
      previousFocusRef.current.focus();
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    element?.focus();
  }, []);

  return { saveFocus, restoreFocus, focusElement };
};
