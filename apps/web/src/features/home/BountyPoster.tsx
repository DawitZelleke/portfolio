import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { EASE } from '@/components/motion';
import { poster } from '@/content/offTheClock';
import { site } from '@/content/site';

/**
 * The easter egg: a weathered wanted poster, in the spirit of the genre
 * rather than a copy of anyone's artwork. Reached by pressing the compass
 * hub on the sea chart (or the visually-hidden button beside it).
 *
 * Reduced motion gets a plain crossfade instead of the stamp sequence.
 */
export function BountyPoster({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      (returnFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Wanted poster"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, rotate: -9 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -1.4 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: 2 }}
            transition={
              reduce
                ? { duration: 0.2 }
                : { type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }
            }
            className="relative w-full max-w-sm overflow-hidden rounded-sm shadow-pop"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            {/* Paper grain + foxed edges, drawn rather than imported */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="poster-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <radialGradient id="poster-foxing" cx="50%" cy="45%" r="62%">
                  <stop offset="60%" stopColor="#000" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--color-accent-deep)" stopOpacity="0.35" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" filter="url(#poster-grain)" opacity="0.14" />
              <rect width="100%" height="100%" fill="url(#poster-foxing)" />
            </svg>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close poster"
              className="absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/10"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="relative px-6 pb-5 pt-7 text-center text-ink">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft">
                {poster.issuer}
              </p>

              <p className="mt-3 font-display text-[2.9rem] font-bold leading-none tracking-[0.04em]">
                WANTED
              </p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-ink-soft">
                dead or alive
              </p>

              <div className="mx-auto mt-4 aspect-[4/3] w-full overflow-hidden border-2 border-ink/70 bg-accent-tint">
                {poster.portrait ? (
                  <img
                    src={poster.portrait}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: 'grayscale(0.35) contrast(1.05)' }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                      <circle cx="26" cy="19" r="9" stroke="var(--color-ink)" strokeWidth="2" opacity="0.5" />
                      <path
                        d="M8 47c2.5-10 9.5-15 18-15s15.5 5 18 15"
                        stroke="var(--color-ink)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
                      no photo on record
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-4 font-display text-xl font-bold uppercase tracking-[0.06em]">
                {site.name}
              </p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft">
                a.k.a. {poster.alias}
              </p>

              <div className="mt-4 border-y-2 border-ink/25 py-3 text-left">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
                  wanted for
                </p>
                <p className="mt-1 text-[0.86rem] leading-snug">{poster.wantedFor}</p>
              </div>

              <div className="mt-3 flex items-baseline justify-between text-left">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
                  reward
                </p>
                <p className="font-display text-[0.95rem] font-bold uppercase tracking-[0.04em]">
                  {poster.reward}
                </p>
              </div>

              <p className="mt-4 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-ink-soft">
                last seen {poster.lastSeen}
              </p>

              {/* Ink stamp, landing a beat after the poster settles */}
              <motion.p
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 2.4, rotate: -22 }}
                animate={reduce ? { opacity: 0.85 } : { opacity: 0.85, scale: 1, rotate: -12 }}
                transition={
                  reduce
                    ? { duration: 0.2, delay: 0.1 }
                    : { duration: 0.32, delay: 0.34, ease: EASE }
                }
                className="pointer-events-none absolute bottom-16 right-4 rounded border-2 border-accent px-2 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-accent"
              >
                {poster.stamp}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
