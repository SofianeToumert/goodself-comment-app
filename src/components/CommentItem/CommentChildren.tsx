import { AnimatePresence, motion } from 'framer-motion';
import { CommentItem } from './CommentItem';
import type { CommentId } from '../../types';
import styles from './CommentItem.module.css';

type CommentChildrenProps = {
  childIds: CommentId[];
  isCollapsed: boolean;
  depth: number;
};

export const CommentChildren = ({
  childIds,
  isCollapsed,
  depth,
}: CommentChildrenProps) => {
  const hasChildren = childIds.length > 0;

  if (!hasChildren) return null;

  return (
    <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.div
          className={styles.children}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <AnimatePresence initial={false}>
            {childIds.map((childId) => (
              <motion.div
                key={childId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <CommentItem id={childId} depth={depth + 1} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
