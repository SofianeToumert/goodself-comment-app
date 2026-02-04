import { useEffect, useRef, type DependencyList } from 'react';

export const useDebouncedEffect = (
  effect: () => void,
  deps: DependencyList,
  delay: number
): void => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      effectRef.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...deps, delay]);
};
