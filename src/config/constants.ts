export const SECTIONS = {
  HOME: 'home',
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CONTACT: 'contact',
} as const;

export const SKILL_CATEGORIES = {
  ALL: 'all',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  TOOLS: 'tools',
  OTHER: 'other',
} as const;

export const NAV_LINKS = [
  { id: SECTIONS.HOME, label: 'Home', href: '#home' },
  { id: SECTIONS.ABOUT, label: 'About', href: '#about' },
  { id: SECTIONS.SKILLS, label: 'Skills', href: '#skills' },
  { id: SECTIONS.PROJECTS, label: 'Projects', href: '#projects' },
  { id: SECTIONS.CONTACT, label: 'Contact', href: '#contact' },
];

export const SOCIAL_ICONS = {
  github: 'Github',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  email: 'Mail',
  phone: 'Phone',
  location: 'MapPin',
} as const;

