import Video from '@/components/Video';
import { useReveal } from '@/hooks/useReveal';

const Journey = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container stack-lg" data-reveal>
        <h1 className="section-title">My Journey</h1>

        <div className="two-col two-col--divided">
          <div className="col stack-md">
            <h2 className="section-title section-title--sub">Milestones</h2>
            <div className="timeline">
              <div className="timeline__item">
                <h3>Start</h3>
                <p>Committed to consistency in faith and fitness.</p>
              </div>
              <div className="timeline__item">
                <h3>Discipline</h3>
                <p>Daily training + journaling to build resilient habits.</p>
              </div>
              <div className="timeline__item">
                <h3>Service</h3>
                <p>Building useful, accessible interfaces for real people.</p>
              </div>
            </div>
          </div>
          <div className="col stack-md">
            <h2 className="section-title section-title--sub">Video Journal</h2>
            <div className="video-grid">
              <Video src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Discipline" />
              <Video src="https://www.youtube.com/embed/o-YBDTqX_ZU" title="Consistency" />
              <Video src="https://www.youtube.com/embed/2vjPBrBU-TM" title="Mindset" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
