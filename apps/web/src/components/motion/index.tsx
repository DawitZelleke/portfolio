/**
 * Motion primitives. Every variant is gated by useReducedMotion —
 * reduced-motion users get instant, opacity-only presentation.
 */
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export function useRevealVariants(distance = 16): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: 0, y: reduce ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.28, ease: EASE },
    },
  };
}

type Tag = 'div' | 'section' | 'ul' | 'li' | 'header' | 'span' | 'p';

type RevealProps = {
  children: ReactNode;
  /** Stagger children (which should be RevealItem) instead of one block */
  stagger?: boolean;
  delay?: number;
  className?: string;
  as?: Tag;
};

export function Reveal({ children, stagger = false, delay = 0, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const variants = useRevealVariants();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      variants={
        stagger
          ? {
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reduce ? 0 : 0.07,
                  delayChildren: reduce ? 0 : delay,
                },
              },
            }
          : { ...variants, visible: { ...variants.visible, transition: { ...(variants.visible as { transition?: object }).transition, delay } } }
      }
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const variants = useRevealVariants();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}
