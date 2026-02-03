import { formatTime, sanitize } from '../../utils';
import styles from './CommentItem.module.css';

type CommentContentProps = {
  text: string;
  createdAt: number;
  isEdited: boolean;
};

export const CommentContent = ({
  text,
  createdAt,
  isEdited,
}: CommentContentProps) => {
  return (
    <>
      <p
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: sanitize(text) }}
      />
      <div className={styles.meta}>
        <span className={styles.time}>{formatTime(createdAt)}</span>
        {isEdited && <span className={styles.edited}>(edited)</span>}
      </div>
    </>
  );
};
