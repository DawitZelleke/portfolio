import { useReveal } from '@/hooks/useReveal';

const About = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container stack-lg" data-reveal>
        <article className="post-card post-card--flush">
          <div className="post-card__media post-card__media--cover" />
          <div className="post-card__body">
            <h1 className="section-title">About Me</h1>
            <p>
              I’m a front-end developer who blends faith-driven discipline with product craft. I
              care about accessibility, clarity, and performance.
            </p>
          </div>
        </article>

        <div className="two-col two-col--equal">
          <div className="col">
            <h2 className="section-title section-title--sub">Origin Story</h2>
            <p>Community roots, perseverance, and a habit of showing up daily.</p>
          </div>
          <div className="col">
            <h2 className="section-title section-title--sub">Why Faith + Fitness</h2>
            <p>Training teaches truth: consistency compounds. That focus guides my work.</p>
          </div>
        </div>

        <div className="stack-md">
          <h2 className="section-title section-title--sub">Skills</h2>
          <ul className="tag-list">
            <li className="tag">JavaScript</li>
            <li className="tag">TypeScript</li>
            <li className="tag">React</li>
            <li className="tag">Vite</li>
            <li className="tag">CSS</li>
            <li className="tag">Node.js</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
