import { memo } from 'react';
import { formatTime, sanitize } from '../../utils';
import styles from './CommentItem.module.css';

type CommentContentProps = {
  id?: string;
  text: string;
  createdAt: number;
  isEdited: boolean;
};

export const CommentContent = memo(function CommentContent({
  id,
  text,
  createdAt,
  isEdited,
}: CommentContentProps) {

  const dateTime = new Date(createdAt).toISOString()

  return (
    <>
      <p
        id={id}
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: sanitize(text) }}
      />
      <div className={styles.meta}>
        <time className={styles.time} dateTime={dateTime}>
          {formatTime(createdAt)}
        </time>
        {isEdited && (
          <span className={styles.edited} aria-label="Comment was edited">
            (edited)
          </span>
        )}
      </div>
    </>
  );
});
