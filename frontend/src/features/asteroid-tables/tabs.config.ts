export const ASTEROID_TABS = [
  { id: 'hazardous', label: '+ DANGEROUS' },
  { id: 'large', label: '+ BIGGEST' },
  { id: 'near', label: '+ CLOSEST' },
] as const;

export type AsteroidCategory = (typeof ASTEROID_TABS)[number]['id'];