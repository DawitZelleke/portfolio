import { Link } from 'react-router-dom';
import { useReveal } from '@/hooks/useReveal';

const Home = () => {
  const rootRef = useReveal<HTMLDivElement>();

  return (
    <div ref={rootRef}>
      <section className="hero-full" aria-label="Intro">
        <div className="hero-overlay">
          <div className="hero-inner reveal" data-reveal>
            <h1 className="site-name">DAVEVSGOLIATH.</h1>
            <p className="lead">
              Discipline, perseverance, and faith meet product craft. I build clean,
              accessible interfaces with React and TypeScript.
            </p>
            <div className="cta-row cta-row--center">
              <Link className="button" to="/projects">
                View my work
              </Link>
              <Link className="button button-ghost" to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col two-col--equal" data-reveal>
          <div className="col">
            <h2 className="section-title">Mission</h2>
            <p>Build useful, accessible experiences with care—and show up daily.</p>
            <p>Faith grounds the process; fitness teaches consistency; craft delivers value.</p>
          </div>
          <div className="col">
            <img src="/sunrise.jpg" alt="Mission visual" className="media-rounded" />
          </div>
        </div>
      </section>

      <div className="cta-bar" data-reveal>
        “Progress compounds when you show up.”
      </div>
    </div>
  );
};

export default Home;
