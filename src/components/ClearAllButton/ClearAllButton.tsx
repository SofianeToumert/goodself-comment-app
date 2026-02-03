import { useComments } from '../../hooks';
import styles from './ClearAllButton.module.css';

export const ClearAllButton = () => {
  const { state, clearAll } = useComments();

  const hasComments = state.rootIds.length > 0;

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all comments?')) {
      clearAll();
    }
  };

  if (!hasComments) return null;

  return (
    <button type="button" className={styles.button} onClick={handleClear}>
      Clear All
    </button>
  );
};
