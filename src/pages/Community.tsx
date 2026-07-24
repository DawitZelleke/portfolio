import { useReveal } from '@/hooks/useReveal';

const Community = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container" data-reveal>
        <h1 className="section-title">Community</h1>
        <div className="two-col two-col--equal">
          <div className="col stack-md">
            <h3>Newsletter</h3>
            <p>Weekly notes on faith, fitness, and front-end craft.</p>
            <form
              className="stack-sm"
              onSubmit={(event) => {
                event.preventDefault();
                window.alert('Subscribed!');
              }}
            >
              <label className="field__label" htmlFor="community-email">
                Email address
              </label>
              <input
                id="community-email"
                className="input"
                placeholder="you@example.com"
                type="email"
                name="email"
                required
                autoComplete="email"
              />
              <button className="button" type="submit">
                Subscribe
              </button>
            </form>
          </div>
          <div className="col stack-md">
            <h3>Social Feed</h3>
            <div className="video-grid video-grid--compact">
              <div className="video-thumb" />
              <div className="video-thumb" />
              <div className="video-thumb" />
              <div className="video-thumb" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
