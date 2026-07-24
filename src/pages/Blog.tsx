import { useReveal } from '@/hooks/useReveal';

const posts = Array.from({ length: 6 }, (_, index) => index + 1);

const Blog = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container container--with-sidebar" data-reveal>
        <div className="stack-lg">
          <h1 className="section-title">Blog &amp; Value</h1>
          <div className="card-grid card-grid--three">
            {posts.map((index) => (
              <article className="post-card reveal" data-reveal key={index}>
                <div className="video-thumb video-thumb--small" />
                <h3>Post Title {index}</h3>
                <p className="muted">A short teaser describing the value and takeaways.</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="sidebar stack-md">
          <form
            className="post-card stack-md"
            method="POST"
            action="https://formspree.io/f/mwkzznny"
          >
            <h3>Get a free resource</h3>
            <p>Join the newsletter for weekly insights.</p>
            <input
              className="input"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <button className="button" type="submit">
              Sign Up
            </button>
          </form>
          <div className="post-card">
            <h3>Featured Post</h3>
            <p>Discipline over motivation: systems that last.</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Blog;
