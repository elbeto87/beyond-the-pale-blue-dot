export const EXOPLANET_TABS = [
  { id: 'latest', label: 'LATEST DISCOVERIES' },
  { id: 'habitable', label: 'POTENTIAL HABITABLE' },
  { id: 'advanced', label: 'ADVANCED SEARCH' },
] as const;

export type ExoplanetCategory = (typeof EXOPLANET_TABS)[number]['id'];

