import { Reveal } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';

export function AboutSection() {
  return (
    <Section id="about" entry="02 · background" title="About me" tone="alt">
      <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
        <Reveal className="space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
          <p>
            I am completing the Web Development and Internet Applications diploma at
            Algonquin College, with graduation expected in December 2026. I previously
            studied software engineering at Carleton University. I am looking for a junior
            web or full-stack developer role starting in January 2027.
          </p>
          <p>
            My projects focus on the details behind everyday web applications: storing and
            validating records, deciding who can change them, and testing what happens
            when a request is invalid. The case studies explain my contributions and link
            to public code where it is available.
          </p>
          <p>
            At Azawent Seniors Association, I coordinated a food delivery program and led
            digital literacy workshops. Alongside my retail and team-lead experience, that
            work taught me to explain problems clearly and support people with different
            levels of technical confidence.
          </p>
        </Reveal>
        <Reveal className="space-y-4">
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <p className="ledger mb-4">At a glance</p>
            <ul className="space-y-3 text-[0.95rem] text-ink">
              <li>Based in {site.location}</li>
              <li>Diploma: {site.graduation}</li>
              <li>{site.availability}</li>
              <li>Seeking junior web / full-stack roles</li>
            </ul>
          </div>
          <ButtonLink
            to={site.resumePath}
            external
            variant="secondary"
            className="w-full"
          >
            Download resume
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
