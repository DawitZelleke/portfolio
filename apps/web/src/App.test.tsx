import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders the brand inside the primary navigation', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(nav).getByText(/DAVEVSGOLIATH/i)).toBeInTheDocument();
  });

  it('routes unknown paths to Home', () => {
    render(
      <MemoryRouter initialEntries={['/no-such-page']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
