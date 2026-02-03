import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import styles from './CommentForm.module.css';

type CommentFormProps = {
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  initialText?: string;
  autoFocus?: boolean;
};

export const CommentForm = ({
  placeholder = 'Write a comment...',
  submitLabel = 'Submit',
  onSubmit,
  onCancel,
  initialText = '',
  autoFocus = false,
}: CommentFormProps) => {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  return (
    <div className={styles.form}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
