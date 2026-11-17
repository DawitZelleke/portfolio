import { Reveal, RevealItem } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { skills } from '@/content/site';

export function SkillsSection() {
  return (
    <Section id="skills" entry="03 · skills" title="What I work with">
      <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <RevealItem
            key={group.group}
            className="rounded-card border border-line bg-surface p-6 shadow-card"
          >
            <h3 className="ledger mb-4">{group.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-canvas px-3 py-1 text-[0.85rem] font-medium text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
