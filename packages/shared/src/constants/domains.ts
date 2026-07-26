export const DOMAINS = {
  CORE: 'CORE',
  DEV: 'DEV',
  QA: 'QA',
  EXP: 'EXP',
  GOV: 'GOV',
} as const;

export type Domain = typeof DOMAINS[keyof typeof DOMAINS];
