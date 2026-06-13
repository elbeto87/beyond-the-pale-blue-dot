import type { AsteroidCategory } from '../asteroid-tables/tabs.config';

export interface ImpactEvent {
  impact_event_id: string;
  asteroid: { asteroid_id: string; name: string; estimated_diameter: number | null };
  date: string;
  impact_probability: number;
  energy: number;
  dangerous_score: number;
}

export interface RankingView {
  endpoint: string;
  title: string;
  subtitle: string;
  metricLabel: string;
  metric: (e: ImpactEvent) => number | string | null;
}

export const RANKING_VIEWS: Record<AsteroidCategory, RankingView> = {
  hazardous: {
    endpoint: '/impact_event/top_by_risk',
    title: 'MOST DANGEROUS',
    subtitle: 'The impact events with the highest potential threat based on energy release, population exposure, and overall risk.',
    metricLabel: 'Riesgo',
    metric: (e) => e.dangerous_score.toFixed(2),
  },
  large: {
    endpoint: '/impact_event/top_by_biggest',
    title: 'LARGEST',
    subtitle: 'The impact events that involve the largest asteroids, measured by their estimated diameter.',
    metricLabel: 'Diametro (m)',
    metric: (e) => e.asteroid.estimated_diameter ?? '—',
  },
  near: {
    endpoint: '/impact_event/top_by_risk',
    title: 'CLOSEST',
    subtitle: 'The impact events with the closest approach to Earth.',
    metricLabel: 'Fecha',
    metric: (e) => e.date,
  },
};
