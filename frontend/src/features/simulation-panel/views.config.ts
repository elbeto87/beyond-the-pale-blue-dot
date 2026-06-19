import type { AsteroidCategory } from '../asteroid-tables/tabs.config';
import type { ImpactEvent } from '../../shared/api/types';

export interface RankingView {
  endpoint: string;
  title: string;
  subtitle: string;
  metricLabel: string;
  metric: (e: ImpactEvent) => number | string | null;
  metricLabel2: string;
  metric2: (e: ImpactEvent) => number | string | null;
}

export const RANKING_VIEWS: Record<AsteroidCategory, RankingView> = {
  hazardous: {
    endpoint: '/impact_event/top_by_risk',
    title: 'MOST DANGEROUS',
    subtitle: 'The impact events with the highest potential threat based on energy release, population exposure, and overall risk.',
    metricLabel: 'Risk',
    metric: (e) => e.dangerous_score.toFixed(2),
    metricLabel2: 'Impact Date',
    metric2: (e) => e.date,
  },
  large: {
    endpoint: '/impact_event/top_by_biggest',
    title: 'BIGGEST',
    subtitle: 'The impact events that involve the largest asteroids, measured by their estimated diameter.',
    metricLabel: 'Diameter (m)',
    metric: (e) => (e.asteroid.estimated_diameter ?? '—') + 'km',
    metricLabel2: 'Impact Date',
    metric2: (e) => e.date,
  },
  near: {
    endpoint: '/impact_event/top_by_probability',
    title: 'MOST LIKELY',
    subtitle: 'The impact events with the highest probability of occurring, regardless of their potential impact severity.',
    metricLabel: 'Probability (%)',
    metric: (e) => (e.impact_probability * 100).toFixed(6) + '%',
    metricLabel2: 'Impact Date',
    metric2: (e) => e.date,
  },
};
