import { Reveal } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';

export function AboutSection() {
  return (
    <Section id="about" entry="01 · profile" title="Software that serves people" tone="alt">
      <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
        <Reveal className="space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
          <p>
            I'm a software engineering and web development student in Ottawa — Carleton
            engineering coursework, now completing a Web Development diploma at Algonquin
            College. I build backend-focused web applications and I care, unusually much,
            about what happens when things go wrong: who had access, what was recorded,
            what an attacker would actually get.
          </p>
          <p>
            That instinct comes from real work. For five years I led technology at the
            Azawent Seniors Association, where I built and deployed the portal that runs
            their event registration and a government-funded food delivery program — then
            taught the seniors using it in weekly digital literacy workshops. Software
            isn't finished when it compiles; it's finished when the least technical person
            in the room can trust it.
          </p>
          <p>
            Before that: air cadets, team-lead roles, the habit of showing up. I'm a
            Canadian citizen eligible for Top Secret clearance, and I'm looking for co-op
            and internship roles where careful engineering matters.
          </p>
        </Reveal>
        <Reveal className="space-y-4">
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <p className="ledger mb-4">quick facts</p>
            <ul className="space-y-3 text-[0.95rem] text-ink">
              <li>📍 {site.location}</li>
              <li>🎓 Algonquin College — Web Development, 2026</li>
              <li>🛡️ Eligible for Top Secret clearance</li>
              <li>🗓️ Available for co-op / internship terms</li>
              <li>🤝 Freelance: community orgs &amp; small business</li>
            </ul>
          </div>
          <ButtonLink to={site.resumePath} external variant="secondary" className="w-full">
            Download resume
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
