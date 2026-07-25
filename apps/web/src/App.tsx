import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/features/home/HomePage';
import { ButtonLink } from '@/components/ui/Button';

const CaseStudyPage = lazy(() =>
  import('@/features/projects/CaseStudyPage').then((m) => ({ default: m.CaseStudyPage })),
);

const AdminApp = lazy(() =>
  import('@/features/admin/AdminApp').then((m) => ({ default: m.AdminApp })),
);

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center">
      <p className="ledger mb-4">404 · not on the record</p>
      <h1 className="font-display text-display font-semibold text-ink">This page doesn’t exist</h1>
      <p className="mt-4 text-ink-soft">The link may be old, or mistyped.</p>
      <div className="mt-8">
        <ButtonLink to="/">Back home</ButtonLink>
      </div>
    </div>
  );
}

/** Scroll to hash targets on route change (e.g. /#projects from a case study). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-button focus:bg-ink focus:px-4 focus:py-2 focus:text-on-dark"
    >
      Skip to content
    </a>
    <ScrollManager />
    <Nav />
    <main id="main" className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<div className="px-5 pt-40 text-center text-ink-soft">Loading…</div>}>
              <CaseStudyPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={<div className="px-5 pt-40 text-center text-ink-soft">Loading…</div>}
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
