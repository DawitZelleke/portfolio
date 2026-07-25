import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '@/components/motion';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';

/**
 * Signature moment: name rises line-by-line from behind masks,
 * role + CTAs cascade after. Runs once, ≤900ms, fades under
 * reduced motion.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const line = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { y: '110%' },
          animate: { y: '0%' },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  const fadeUp = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: EASE },
        };

  return (
    <section id="top" className="bg-canvas px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      <div className="mx-auto w-full max-w-5xl">
        <motion.p className="ledger ledger-rule mb-6" {...fadeUp(0.05)}>
          00 · {site.location} · open to co-op &amp; freelance
        </motion.p>

        <h1 className="font-display text-display-xl font-bold tracking-tight text-ink">
          <span className="block overflow-hidden pb-1">
            <motion.span className="block" {...line(0.1)}>
              {site.name.split(' ')[0]}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span className="block text-accent-bright" {...line(0.2)}>
              {site.name.split(' ')[1]}
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl"
          {...fadeUp(0.42)}
        >
          {site.role}. {site.tagline} Node.js and React on the surface — role-based access
          control, encryption, and audit logging underneath.
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fadeUp(0.55)}>
          <ButtonLink to="#projects" external>
            View my work
          </ButtonLink>
          <ButtonLink to={site.resumePath} external variant="secondary">
            Resume (PDF)
          </ButtonLink>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="px-2 py-2 text-sm font-semibold text-ink-soft underline-offset-4 hover:text-accent hover:underline"
          >
            GitHub ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
