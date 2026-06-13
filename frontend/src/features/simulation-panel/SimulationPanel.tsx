import { useEffect, useState } from 'react';
import { useActiveCategory } from '../asteroid-tables/category.store';
import { RANKING_VIEWS, type ImpactEvent } from './views.config';

const API_BASE = '';

export function SimulationPanel() {
  const active = useActiveCategory((s) => s.active);
  const view = RANKING_VIEWS[active];

  const [events, setEvents] = useState<ImpactEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}${view.endpoint}?count=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ImpactEvent[]) => setEvents(data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [view.endpoint]);

  return (
    <div className="sim-panel">
      <h2 className="sim-panel__title">{view.title}</h2>
      <p className="sim-panel__subtitle">{view.subtitle}</p>

      <div className="sim-panel__list">
        {loading && <span className="sim-panel__hint">Cargando...</span>}
        {error && <span className="sim-panel__hint">Error: {error}</span>}
        {!loading && !error && events.length === 0 && (
          <span className="sim-panel__hint">Sin datos disponibles todavia.</span>
        )}
        {events.map((event, index) => (
          <div key={event.impact_event_id} className="risk-row">
            <span className="risk-row__rank">{index + 1}</span>
            <span className="risk-row__name">{event.asteroid.name}</span>
            <span className="risk-row__score">{view.metric(event)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}