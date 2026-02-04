import { useCallback } from 'react';
import { useComments, useModal } from '../../hooks';
import styles from './ClearAllButton.module.css';

export const ClearAllButton = () => {
  const { state, clearAll } = useComments();
  const { openModal } = useModal();

  const hasComments = state.rootIds.length > 0;

  const handleClearClick = useCallback(() => {
    openModal({
      title: 'Clear All Comments',
      message: 'Are you sure you want to delete all comments? This action cannot be undone.',
      confirmLabel: 'Clear All',
      variant: 'danger',
      onConfirm: clearAll,
    });
  }, [openModal, clearAll]);

  if (!hasComments) return null;

  return (
    <button type="button" className={styles.button} onClick={handleClearClick}>
      Clear All
    </button>
  );
};
