export const ASTEROID_TABS = [
  { id: 'large', label: '+ BIGGEST' },
  { id: 'hazardous', label: '+ DANGEROUS' },
  { id: 'near', label: '+ CLOSEST' },
] as const;

export type AsteroidCategory = (typeof ASTEROID_TABS)[number]['id'];