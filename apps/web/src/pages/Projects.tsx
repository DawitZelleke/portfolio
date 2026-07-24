const projects = [
  {
    title: 'Portfolio Website',
    description: 'Responsive personal site with clean navigation and routing.',
  },
  {
    title: 'Dashboard',
    description: 'Interactive data views with filters and empty/error states.',
  },
  {
    title: 'API Explorer',
    description: 'Small tool to browse and test REST endpoints.',
  },
];

const Projects = () => {
  return (
    <section className="section">
      <div className="container paper">
        <h1 className="section-title">Projects</h1>
        <p>Selected work focused on clarity, performance, and UX.</p>

        <div className="grid">
          {projects.map(({ title, description }) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
              <a
                className="button button-ghost"
                href="#"
                aria-disabled="true"
                tabIndex={-1}
                role="link"
              >
                View on GitHub
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
