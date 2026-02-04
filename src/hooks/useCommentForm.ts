import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
  type KeyboardEvent,
} from 'react';
import {
  validateCommentText,
  getRemainingCharacters,
  isNearLimit,
} from '../services';

type UseCommentFormOptions = {
  initialText?: string;
  autoFocus?: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
};

type UseCommentFormReturn = {
  // State
  text: string;
  setText: (text: string) => void;

  // Validation
  isValid: boolean;
  errors: string[];
  isEmpty: boolean;

  // Character count
  remaining: number;
  showWarning: boolean;

  // Refs
  textareaRef: RefObject<HTMLTextAreaElement>;

  // Handlers
  handleSubmit: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const useCommentForm = ({
  initialText = '',
  autoFocus = false,
  onSubmit,
  onCancel,
}: UseCommentFormOptions): UseCommentFormReturn => {
  const [text, setText] = useState<string>(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Validation
  const { isValid, errors } = validateCommentText(text);
  const remaining = getRemainingCharacters(text);
  const showWarning = isNearLimit(text);
  const isEmpty = text.trim().length === 0;

  // Auto-focus effect
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed && isValid) {
      onSubmit(trimmed);
      setText('');
    }
  }, [text, isValid, onSubmit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    },
    [handleSubmit, onCancel]
  );

  return {
    text,
    setText,
    isValid,
    errors,
    isEmpty,
    remaining,
    showWarning,
    textareaRef,
    handleSubmit,
    handleKeyDown,
  };
};
