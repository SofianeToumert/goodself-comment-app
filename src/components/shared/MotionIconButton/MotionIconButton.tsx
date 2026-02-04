import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type MotionIconButtonProps = Omit<HTMLMotionProps<'button'>, 'children' | 'title'> & {
  children: ReactNode;
  label: string;
  hoverScale?: number;
  tapScale?: number;
  pressed?: boolean;
};

export const MotionIconButton = forwardRef<HTMLButtonElement, MotionIconButtonProps>(
  function MotionIconButton(
    { children, label, hoverScale = 1.1, tapScale = 0.9, pressed, ...props },
    ref
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileTap={{ scale: tapScale }}
        whileHover={{ scale: hoverScale }}
        aria-label={label}
        aria-pressed={pressed}
        title={label}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
