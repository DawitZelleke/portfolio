import { useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Blog from './pages/Blog';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Journey from './pages/Journey';
import Projects from './pages/Projects';
import Shop from './pages/Shop';
import './App.css';

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

          <ul
            id="primary-navigation"
            className={`nav-links${menuOpen ? ' is-open' : ''}`}
          >
            <li>
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/journey"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Journey
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Community
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                Contact
              </NavLink>
            </li>
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
          <Route path="/journey" element={<Journey />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
