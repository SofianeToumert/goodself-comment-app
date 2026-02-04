/**
 * Hook for managing comment form state and interactions.
 * Handles validation, character counting, and keyboard shortcuts.
 * @module hooks/useCommentForm
 */

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

/**
 * Configuration options for the useCommentForm hook.
 */
type UseCommentFormOptions = {
  /** Initial text to populate the form with (default: '') */
  initialText?: string;
  /** Whether to auto-focus the textarea on mount (default: false) */
  autoFocus?: boolean;
  /** Callback invoked when form is submitted with valid text */
  onSubmit: (text: string) => void;
  /** Optional callback invoked when form is cancelled (Escape key) */
  onCancel?: () => void;
};

/**
 * Return type for the useCommentForm hook.
 */
type UseCommentFormReturn = {
  /** Current text value */
  text: string;
  /** Function to update the text value */
  setText: (text: string) => void;
  /** Whether the current text passes validation */
  isValid: boolean;
  /** Array of validation error messages */
  errors: string[];
  /** Whether the text is empty (after trimming) */
  isEmpty: boolean;
  /** Number of characters remaining before limit */
  remaining: number;
  /** Whether to show the character limit warning */
  showWarning: boolean;
  /** Ref to attach to the textarea element */
  textareaRef: RefObject<HTMLTextAreaElement>;
  /** Handler for form submission */
  handleSubmit: () => void;
  /** Handler for keyboard events (Enter to submit, Escape to cancel) */
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

/**
 * Hook for managing comment form logic including validation and submission.
 * Provides text state, validation results, and event handlers.
 *
 * @param options - Configuration options for the form
 * @returns Object containing form state and handlers
 *
 * @example
 * ```tsx
 * const {
 *   text,
 *   setText,
 *   isValid,
 *   remaining,
 *   handleSubmit,
 *   handleKeyDown,
 *   textareaRef,
 * } = useCommentForm({
 *   onSubmit: (text) => addComment(null, text),
 *   autoFocus: true,
 * });
 *
 * return (
 *   <textarea
 *     ref={textareaRef}
 *     value={text}
 *     onChange={(e) => setText(e.target.value)}
 *     onKeyDown={handleKeyDown}
 *   />
 * );
 * ```
 */
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
