# Components Architecture

## Component Hierarchy

```
App
└── CommentsProvider (state context)
    └── ErrorBoundary
        ├── CommentForm (root comment input)
        ├── CommentList
        │   └── CommentItem (recursive)
        │       ├── CommentContent
        │       ├── LikeDislikeButtons
        │       │   └── VoteButton
        │       ├── CommentActions
        │       ├── CommentForm (reply/edit)
        │       ├── CommentChildren (recursive)
        │       └── ConfirmModal (delete confirmation)
        └── ClearAllButton
```

## Component Reference

### CommentForm
Reusable form component for creating and editing comments.

```typescript
interface CommentFormProps {
  placeholder?: string;      // Input placeholder text
  submitLabel?: string;      // Submit button text
  onSubmit: (text: string) => void;
  onCancel?: () => void;     // Cancel handler (shows cancel button if provided)
  initialText?: string;      // Pre-fill text for editing
  autoFocus?: boolean;       // Focus textarea on mount
}
```

**Features:**
- Character counter with limit warning
- Real-time validation feedback
- Keyboard shortcuts: Enter to submit, Escape to cancel
- Accessible form controls with ARIA attributes

### CommentItem
Main comment display component with full interaction support.

```typescript
interface CommentItemProps {
  id: CommentId;             // Comment identifier
  depth?: number;            // Nesting level (for indentation)
}
```

**Features:**
- Recursive rendering for nested comments
- Inline editing mode
- Reply form toggle
- Delete confirmation modal
- Like/dislike voting
- Collapse/expand for threads
- Keyboard navigation (Enter to reply)
- Full accessibility support

### CommentContent
Displays the comment text with metadata.

```typescript
interface CommentContentProps {
  id?: string;               // DOM id for aria-labelledby
  text: string;              // Comment text (sanitized)
  createdAt: number;         // Timestamp
  isEdited: boolean;         // Show "(edited)" indicator
}
```

### LikeDislikeButtons
Vote button pair for comment reactions.

```typescript
interface LikeDislikeButtonsProps {
  likes: number;
  dislikes: number;
  userVote: UserVote;        // 'like' | 'dislike' | null
  onLike: () => void;
  onDislike: () => void;
}
```

### CommentActions
Action buttons for comment operations.

```typescript
interface CommentActionsProps {
  isReplying: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onReplyClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCollapseClick: () => void;
}
```

### ErrorBoundary
Catches rendering errors in the comment tree.

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;      // Custom error UI (optional)
}
```

**Features:**
- Displays user-friendly error message
- "Try Again" recovery action
- Logs errors to console (pluggable for Sentry/DataDog)

### ConfirmModal
Accessible confirmation dialog.

```typescript
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;     // Default: "Confirm"
  cancelLabel?: string;      // Default: "Cancel"
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Features:**
- Focus trap (Tab cycles within modal)
- Escape key to cancel
- Click outside to cancel
- Focus restoration on close
- Animated entrance/exit

## Styling

All components use CSS Modules with design tokens from `src/styles/variables.css`:

```css
/* Colors */
--color-primary: #4f46e5;
--color-danger: #dc2626;
--color-text: #1f2937;
--color-text-muted: #6b7280;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;

/* Animation */
--animation-duration-fast: 0.15s;
--animation-duration-normal: 0.25s;
```

## Accessibility

All components follow WCAG 2.1 guidelines:

- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape)
- **Screen Readers**: ARIA labels, roles, and live regions
- **Focus Management**: Proper focus trapping and restoration
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Performance

Components are optimized for performance:

- `React.memo` on all CommentItem sub-components
- Memoized callbacks with `useCallback`
- Debounced localStorage writes (300ms)
- Memoized selectors for computed state
