import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navSections, site } from '@/content/site';

/** Scroll-spy: which section currently owns the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState('top');
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const s of navSections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

export function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(onHome);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const linkFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-base ${
        scrolled || menuOpen
          ? 'border-b border-line bg-canvas/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.08em] text-ink"
        >
          <img src="/icons8-fido.svg" alt="" aria-hidden="true" className="h-6 w-6" />
          {site.brand}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navSections.map((s) => {
            const isActive = onHome && active === s.id;
            return (
              <li key={s.id} className="relative">
                <a
                  href={linkFor(s.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`rounded-button px-3 py-2 text-[0.9rem] font-medium transition-colors duration-fast ${
                    isActive ? 'text-accent' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {s.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId={reduce ? undefined : 'nav-dot'}
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-bright"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <a
          href={linkFor('contact')}
          className="hidden rounded-button bg-ink px-4 py-2 text-[0.9rem] font-semibold text-on-dark transition-colors duration-fast hover:bg-accent-deep md:inline-flex"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-button text-ink md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <motion.ul
          id="mobile-navigation"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-line bg-canvas px-5 py-3 md:hidden"
        >
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={linkFor(s.id)}
                onClick={() => setMenuOpen(false)}
                className="block rounded-button px-2 py-3 text-base font-medium text-ink-soft hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </nav>
  );
}
