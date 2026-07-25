/**
 * Static site content — the single source for copy that lives in code.
 * Projects come from fixtures (M2) → API (M4).
 */
export const site = {
  brand: 'DAVEVSGOLIATH',
  name: 'Dawit Zelleke',
  role: 'Full-stack developer',
  tagline: 'I build web applications that are safe to trust.',
  location: 'Ottawa, ON',
  email: 'Dawit.Zelleke13@gmail.com',
  github: 'https://github.com/DawitZelleke',
  linkedin: 'https://linkedin.com/in/DawitZelleke13',
  resumePath: '/Dawit_Zelleke_Resume.pdf',
  meta: {
    title: 'Dawit Zelleke — Full-stack developer, Ottawa',
    description:
      'Full-stack developer in Ottawa building secure, backend-focused web applications. JavaScript, Node.js, React, PostgreSQL — with RBAC, encryption, and audit logging built in.',
  },
} as const;

export const navSections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export const skills = [
  {
    group: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C/C++ (coursework)'],
  },
  {
    group: 'Web & frameworks',
    items: ['React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    group: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'REST API design', 'Drizzle ORM'],
  },
  {
    group: 'Security',
    items: [
      'Role-based access control',
      'Encryption at rest & in transit',
      'Audit logging',
      'HTTPS/TLS',
      'Input validation',
    ],
  },
  {
    group: 'Tools & practices',
    items: ['Git/GitHub', 'Linux & bash', 'Docker', 'Agile/Scrum', 'Automated testing', 'Figma'],
  },
] as const;

export const experience = [
  {
    org: 'Azawent Seniors Association',
    role: 'Team Lead',
    span: '2020 — 2025',
    where: 'Ottawa, ON',
    points: [
      'Designed and deployed a full-stack community portal for event registration, volunteer coordination, and service scheduling.',
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
    span: 'Expected 2026',
  },
  {
    school: 'Carleton University',
    program: 'Coursework toward B.Eng., Software Engineering',
    span: '2020 — 2024',
  },
] as const;
