import { AnimatePresence, motion } from 'framer-motion';
import { CommentsProvider } from './state';
import { useComments } from './hooks';
import { CommentForm } from './components/CommentForm';
import { CommentItem } from './components/CommentItem';
import { ClearAllButton } from './components/ClearAllButton';
import styles from './App.module.css';

const CommentList = () => {
  const { state, addComment } = useComments();

  return (
    <>
      <CommentForm
        placeholder="Enter new comment here"
        onSubmit={(text) => addComment(null, text)}
      />
      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {state.rootIds.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <CommentItem id={id} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ClearAllButton />
    </>
  );
};

const App = () => (
  <CommentsProvider>
    <main className={styles.container}>
      <h1 className={styles.title}>COMMENTS</h1>
      <CommentList />
    </main>
  </CommentsProvider>
);

export default App;
