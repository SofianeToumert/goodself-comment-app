import { useCommentForm } from '../../hooks';
import { COMMENT_MAX_LENGTH } from '../../services';
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
  const {
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
  } = useCommentForm({
    initialText,
    autoFocus,
    onSubmit,
    onCancel,
  });

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
        maxLength={COMMENT_MAX_LENGTH}
        aria-label={placeholder}
        aria-invalid={!isEmpty && !isValid}
        aria-describedby="comment-form-feedback"
      />
      <div className={styles.feedback} id="comment-form-feedback">
        <div
          className={`${styles.charCount} ${showWarning ? styles.warning : ''} ${remaining < 0 ? styles.error : ''}`}
          aria-live="polite"
        >
          {remaining.toLocaleString()} characters remaining
        </div>
        {!isEmpty && errors.length > 0 && (
          <div className={styles.errors} role="alert">
            {errors.map((error) => (
              <span key={error} className={styles.errorText}>
                {error}
              </span>
            ))}
          </div>
        )}
      </div>
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
          disabled={isEmpty || !isValid}
          aria-disabled={isEmpty || !isValid}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
