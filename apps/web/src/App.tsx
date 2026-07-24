import { useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Projects from './pages/Projects';
import './App.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const;

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="frame">
      <nav className="navbar" aria-label="Primary">
        <div className="nav-left">
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
          </button>

          <ul id="primary-navigation" className={`nav-links${menuOpen ? ' is-open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-center">
          <Link to="/" className="brand nav-title" onClick={closeMenu}>
            <img src="/icons8-fido.svg" alt="" className="logo-mark" aria-hidden="true" />
            DAVEVSGOLIATH
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/contact" className="nav-link contact-pill" onClick={closeMenu}>
            Contact
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
