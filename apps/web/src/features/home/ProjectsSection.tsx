import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { Chip } from '@/components/ui/Chip';
import { fetchProjects } from '@/lib/api';

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-line bg-surface p-6">
      <div className="mb-4 h-4 w-2/3 rounded bg-surface-2" />
      <div className="mb-2 h-3 w-full rounded bg-surface-2" />
      <div className="h-3 w-5/6 rounded bg-surface-2" />
    </div>
  );
}

export function ProjectsSection() {
  const reduce = useReducedMotion();
  const { data: projects, isPending } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60_000,
  });

  return (
    <Section
      id="projects"
      entry="01 · selected projects"
      title="Selected work"
      tone="alt"
    >
      <p className="mb-8 max-w-3xl text-ink-soft">
        Selected applications and security work. Each case study explains the
        implementation, supporting evidence, and current limitations.
      </p>
      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <Reveal stagger className="grid gap-6 md:grid-cols-2">
          {(projects ?? [])
            .filter((p) => p.featured)
            .map((p) => (
              <RevealItem key={p.id} className="h-full">
                <motion.article
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="group relative flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-shadow duration-fast hover:shadow-lift"
                >
                  <h3 className="font-display text-title font-semibold text-ink">
                    <Link
                      to={`/projects/${p.slug}`}
                      className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[0.98rem] leading-relaxed text-ink-soft">
                    {p.summary}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 6).map((t) => (
                      <li key={t}>
                        <Chip>{t}</Chip>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm font-semibold text-accent">
                    Read the case study
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-fast group-hover:translate-x-1"
                    >
                      {' '}
                      →
                    </span>
                  </p>
                  <div className="relative z-10 mt-4 flex flex-wrap gap-4 text-sm">
                    {p.links.github ? (
                      <a
                        href={p.links.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-semibold text-accent underline underline-offset-4"
                      >
                        Source code<span className="sr-only"> for {p.title}</span>
                      </a>
                    ) : (
                      <span className="text-ink-faint">Source currently private</span>
                    )}
                    {p.links.docs && (
                      <a
                        href={p.links.docs}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-semibold text-accent underline underline-offset-4"
                      >
                        Verification notes
                      </a>
                    )}
                  </div>
                </motion.article>
              </RevealItem>
            ))}
        </Reveal>
      )}
    </Section>
  );
}
