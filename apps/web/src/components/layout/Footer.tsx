import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="bg-footer px-5 py-12 text-on-dark-soft sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.08em] text-on-dark">
            {site.brand}
          </p>
          <p className="mt-1 font-mono text-xs">
            {site.name} · {site.location} · © {new Date().getFullYear()}
          </p>
        </div>
        <ul className="flex items-center gap-5 text-sm font-medium">
          <li>
            <a className="hover:text-on-dark" href={site.github} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          </li>
          <li>
            <a className="hover:text-on-dark" href={site.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="hover:text-on-dark" href={`mailto:${site.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
