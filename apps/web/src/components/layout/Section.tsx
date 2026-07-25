import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion';

type SectionProps = {
  id: string;
  /** Ledger eyebrow, e.g. "01 · profile" */
  entry: string;
  title: string;
  tone?: 'canvas' | 'alt';
  children: ReactNode;
};

/**
 * Section shell with the "audit ledger" device: a mono eyebrow entry
 * with a trailing rule, encoding position + section name.
 */
export function Section({ id, entry, title, tone = 'canvas', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-5 py-[clamp(4rem,9vw,7rem)] sm:px-8 ${
        tone === 'alt' ? 'bg-surface-2' : 'bg-canvas'
      }`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal as="header" className="mb-10 sm:mb-14">
          <p className="ledger ledger-rule mb-3">{entry}</p>
          <h2 className="font-display text-display font-semibold tracking-tight text-ink">
            {title}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
