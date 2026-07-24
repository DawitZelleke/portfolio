import '@testing-library/jest-dom';

// jsdom lacks IntersectionObserver; useReveal (and future motion code) needs it.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ?? IntersectionObserverStub;

// jsdom also lacks matchMedia (needed by prefers-reduced-motion checks in M1+).
globalThis.matchMedia =
  globalThis.matchMedia ??
  ((query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList);
