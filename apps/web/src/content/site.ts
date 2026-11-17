/**
 * Static site content — the single source for copy that lives in code.
 * Projects come from fixtures (M2) → API (M4).
 */
export const site = {
  brand: 'DAVEVSGOLIATH',
  name: 'Dawit Zelleke',
  role: 'Junior web / full-stack developer',
  tagline: 'I build database-backed web applications with C#, PHP, and JavaScript.',
  availability: 'Available January 2027',
  graduation: 'Expected December 2026',
  location: 'Ottawa, ON',
  email: 'Dawit.Zelleke13@gmail.com',
  github: 'https://github.com/DawitZelleke',
  linkedin: 'https://linkedin.com/in/DawitZelleke13',
  resumePath: '/Dawit_Zelleke_Resume.pdf',
  meta: {
    title: 'Dawit Zelleke — Junior web developer, Ottawa',
    description:
      'Junior web developer in Ottawa. ASP.NET Core, Laravel, React, and SQL. Graduating December 2026; available January 2027.',
  },
} as const;

export const navSections = [
  { id: 'top', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'off-duty', label: 'Off-duty' },
  { id: 'contact', label: 'Contact' },
] as const;

export const skills = [
  {
    group: 'Languages',
    items: ['C#', 'PHP', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    group: 'Web applications',
    items: ['ASP.NET Core MVC', 'Laravel', 'Livewire', 'React', 'Node.js', 'Express'],
  },
  {
    group: 'Data',
    items: [
      'Entity Framework Core',
      'Eloquent',
      'SQLite',
      'PostgreSQL',
      'Database migrations',
    ],
  },
  {
    group: 'Application security',
    items: [
      'Ownership authorization',
      'CSRF protection',
      'Parameterized queries',
      'Password hashing',
      'Input validation',
    ],
  },
  {
    group: 'Testing and workflow',
    items: ['PHPUnit', 'Vitest', 'Git', 'GitHub', 'Linux', 'Regression testing'],
  },
] as const;

export const experience = [
  {
    org: 'Azawent Seniors Association',
    role: 'Team Lead',
    span: '2020 — 2025',
    where: 'Ottawa, ON',
    points: [
      'Managed a government-funded food delivery program and led weekly digital literacy workshops for seniors.',
    ],
  },
  {
    org: 'The Home Depot Canada',
    role: 'Flooring Associate',
    span: '2025 — present',
    where: 'Ottawa, ON',
    points: [
      'Solve customer problems collaboratively in a fast-paced retail environment, balancing multiple priorities with accuracy.',
    ],
  },
  {
    org: "McDonald's Canada",
    role: 'Team Lead',
    span: '2020 — 2023',
    where: 'Ottawa, ON',
    points: [
      'Supervised a team of 5+, handled scheduling and onboarding, and implemented stock-control improvements.',
    ],
  },
  {
    org: '211 Kiwanis Air Cadet Squadron',
    role: 'Cadet / Peer Leader',
    span: '2013 — 2018',
    where: 'Ottawa, ON',
    points: [
      'Mentored peers and coordinated project-based training in a structured, discipline-focused program.',
    ],
  },
] as const;

export const education = [
  {
    school: 'Algonquin College',
    program: 'Diploma, Web Development & Internet Applications',
    span: 'Expected December 2026',
  },
  {
    school: 'Carleton University',
    program: 'Coursework toward B.Eng., Software Engineering',
    span: '2020 — 2024',
  },
] as const;
