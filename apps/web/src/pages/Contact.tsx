import { useReveal } from '@/hooks/useReveal';

const Contact = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container" data-reveal>
        <h1 className="section-title">Contact</h1>
        <div className="two-col two-col--equal">
          <div className="col">
            <form
              className="post-card stack-md"
              onSubmit={(event) => {
                event.preventDefault();
                window.alert('Thanks! I will get back to you soon.');
              }}
            >
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="input"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="input"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="textarea"
                  rows={5}
                  required
                />
              </div>

              <button className="button" type="submit">
                Send
              </button>
            </form>
          </div>

          <div className="col stack-md">
            <div className="post-card">
              <h3>Want to pray together?</h3>
              <p>Send a note. I’m honored to pray with you.</p>
            </div>
            <div className="post-card">
              <h3>Socials</h3>
              <p>
                <a href="#" aria-disabled="true" tabIndex={-1} role="link">
                  Instagram
                </a>{' '}
                ·{' '}
                <a href="#" aria-disabled="true" tabIndex={-1} role="link">
                  YouTube
                </a>{' '}
                ·{' '}
                <a href="#" aria-disabled="true" tabIndex={-1} role="link">
                  Twitter
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
