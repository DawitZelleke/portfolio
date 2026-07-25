import { Reveal, RevealItem } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { education, experience } from '@/content/site';

export function ExperienceSection() {
  return (
    <>
      <Section id="experience" entry="04 · track record" title="Experience">
        <Reveal stagger className="space-y-0">
          {experience.map((job) => (
            <RevealItem
              key={`${job.org}-${job.role}`}
              className="grid gap-2 border-b border-line py-7 first:pt-0 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-[0.8rem] font-medium text-ink-faint">{job.span}</p>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {job.role} · {job.org}
                </h3>
                <p className="mt-0.5 text-sm text-ink-faint">{job.where}</p>
                <ul className="mt-3 space-y-2 text-[0.98rem] leading-relaxed text-ink-soft">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section id="education" entry="05 · foundations" title="Education" tone="alt">
        <Reveal stagger className="grid gap-5 sm:grid-cols-2">
          {education.map((ed) => (
            <RevealItem
              key={ed.school}
              className="rounded-card border border-line bg-surface p-6 shadow-card"
            >
              <p className="font-mono text-[0.8rem] font-medium text-ink-faint">{ed.span}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{ed.school}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">{ed.program}</p>
            </RevealItem>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
