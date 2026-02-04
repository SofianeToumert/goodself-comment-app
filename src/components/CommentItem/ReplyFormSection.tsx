import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CommentForm } from '../CommentForm';
import styles from './CommentItem.module.css';

type ReplyFormSectionProps = {
  isVisible: boolean;
  onSubmit: (text: string) => void;
  onCancel: () => void;
};

export const ReplyFormSection = memo(function ReplyFormSection({
  isVisible,
  onSubmit,
  onCancel,
}: ReplyFormSectionProps) {
  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className={styles.replyForm}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <CommentForm
            placeholder="Write a reply..."
            submitLabel="Reply"
            onSubmit={onSubmit}
            onCancel={onCancel}
            autoFocus
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
