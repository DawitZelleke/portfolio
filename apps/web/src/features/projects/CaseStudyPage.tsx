import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { Reveal } from '@/components/motion';
import { ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { fetchProject } from '@/lib/api';
import { site } from '@/content/site';

export function CaseStudyPage() {
  const { slug = '' } = useParams();
  const { data: project, isPending } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject(slug),
  });

  useEffect(() => {
    document.title = project ? `${project.title} — ${site.name}` : site.meta.title;
    return () => {
      document.title = site.meta.title;
    };
  }, [project]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-5 pb-24 pt-36">
        <div className="mb-6 h-4 w-40 rounded bg-surface-2" />
        <div className="mb-4 h-10 w-3/4 rounded bg-surface-2" />
        <div className="h-4 w-full rounded bg-surface-2" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-36 text-center">
        <p className="ledger mb-4">404 · not on the record</p>
        <h1 className="font-display text-display font-semibold">No such case study</h1>
        <p className="mt-4 text-ink-soft">
          It may have been unpublished, or the link is off.
        </p>
        <div className="mt-8">
          <ButtonLink to="/#projects">Back to projects</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <article className="px-5 pb-24 pt-36 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <p className="ledger ledger-rule mb-5">
            case study ·{' '}
            {project.publishedAt
              ? new Date(project.publishedAt).getFullYear()
              : 'project overview'}
          </p>
          <h1 className="font-display text-display font-bold tracking-tight text-ink">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{project.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t}>
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.github && (
              <ButtonLink to={project.links.github} external variant="secondary">
                View source ↗
              </ButtonLink>
            )}
            {project.links.docs && (
              <ButtonLink to={project.links.docs} external variant="secondary">
                Verification notes
              </ButtonLink>
            )}
            {project.links.live && (
              <ButtonLink to={project.links.live} external>
                Visit live ↗
              </ButtonLink>
            )}
          </div>
        </Reveal>

        <Reveal className="prose-custom mt-12 border-t border-line pt-10" delay={0.1}>
          <Markdown remarkPlugins={[remarkGfm]}>{project.body}</Markdown>
        </Reveal>

        <div className="mt-16 border-t border-line pt-8">
          <Link
            to="/#projects"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            ← All projects
          </Link>
        </div>
      </div>
    </article>
  );
}
