export const EXOPLANET_TABS = [
  { id: 'latest', label: '+ LATEST' },
  { id: 'habitable', label: 'POTENTIAL HABITABLE' },
] as const;

export type ExoplanetCategory = (typeof EXOPLANET_TABS)[number]['id'];

