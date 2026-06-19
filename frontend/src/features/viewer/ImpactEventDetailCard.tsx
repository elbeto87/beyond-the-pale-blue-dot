import { useSelectedImpactEvent } from './selectedImpactEvent.store';
import type { ImpactEvent } from '../../shared/api/types';

interface DetailRow {
  label: string;
  value: (event: ImpactEvent) => string;
}

const DETAIL_ROWS: DetailRow[] = [
  { label: 'Asteroid name', value: (e) => e.asteroid.name },
  { label: 'Impact date', value: (e) => e.date },
  { label: 'Probability', value: (e) => `${(e.impact_probability * 100).toFixed(6)} %` },
  { label: 'Energy', value: (e) => `${e.energy.toLocaleString()} kt` },
  { label: 'Risk score', value: (e) => e.dangerous_score.toFixed(2) },
  {
    label: 'Asteroid diameter',
    value: (e) =>
      e.asteroid.estimated_diameter != null ? `${e.asteroid.estimated_diameter.toLocaleString()} m` : '—',
  },
  {
    label: 'Magnitude (H)',
    value: (e) => (e.asteroid.absolute_magnitude_h != null ? e.asteroid.absolute_magnitude_h.toString() : '—'),
  },
];

export function ImpactEventDetailCard() {
  const selected = useSelectedImpactEvent((state) => state.selected);

  if (!selected) {
    return (
      <div className="detail-card detail-card--empty">
        <span className="detail-card__hint">Select an impact event to see its data sheet.</span>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <span className="detail-card__eyebrow">IMPACT EVENT</span>
        <h3 className="detail-card__name">{selected.impact_event_id}</h3>
      </div>
      <dl className="detail-card__grid">
        {DETAIL_ROWS.map((row) => (
          <div key={row.label} className="detail-card__row">
            <dt className="detail-card__label">{row.label}</dt>
            <dd className="detail-card__value">{row.value(selected)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

