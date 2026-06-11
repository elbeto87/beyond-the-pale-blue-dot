export const ASTEROID_TABS = [
  { id: 'large', label: '+ GRANDES' },
  { id: 'hazardous', label: '+ PELIGROSOS' },
  { id: 'near', label: '+ CERCANOS' },
] as const;

export type AsteroidCategory = (typeof ASTEROID_TABS)[number]['id'];