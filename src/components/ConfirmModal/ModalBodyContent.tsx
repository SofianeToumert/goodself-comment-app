import { forwardRef } from 'react';
import styles from './ConfirmModal.module.css';

type ModalBodyContentProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export const ModalBodyContent = forwardRef<HTMLButtonElement, ModalBodyContentProps>(
  function ModalBodyContent(
    { title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel },
    confirmButtonRef
  ) {
    return (
      <>
        <h2 id="confirm-modal-title" className={styles.title}>
          {title}
        </h2>
        <p id="confirm-modal-message" className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`${styles.confirmButton} ${variant === 'danger' ? styles.danger : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </>
    );
  }
);
