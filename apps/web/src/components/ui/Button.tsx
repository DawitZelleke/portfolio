import { motion, useReducedMotion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary:
    'bg-ink text-on-dark hover:bg-accent-deep shadow-card hover:shadow-lift',
  secondary:
    'bg-transparent text-ink border border-line-strong hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-accent hover:bg-accent-tint',
};

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-button px-5 py-2.5 font-sans text-[0.95rem] font-semibold transition-colors duration-fast cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: CommonProps & ComponentProps<typeof motion.button>) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function ButtonLink({
  variant = 'primary',
  to,
  external = false,
  children,
  className = '',
}: CommonProps & { to: string; external?: boolean }) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={to} className={cls} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
