import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderApp(path = '/') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renders brand in nav and the hero name', () => {
    renderApp();
    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(nav).getByText(/DAVEVSGOLIATH/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Dawit/i);
  });

  it('renders all home sections', () => {
    renderApp();
    for (const id of ['about', 'skills', 'projects', 'experience', 'education', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  it('shows 404 for unknown routes', () => {
    renderApp('/nope');
    expect(screen.getByText(/doesn’t exist/i)).toBeInTheDocument();
  });
});
