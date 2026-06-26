import { useEffect, useState } from 'react';
import { useActiveCategory } from '../asteroid-tables/category.store';
import { RANKING_VIEWS } from './views.config';
import { useSelectedImpactEvent } from '../viewer/selectedImpactEvent.store';
import type { ImpactEvent } from '../../shared/api/types';
import {API_CONFIG} from "../../shared/api/config";
import {YearRangeSelect} from "./YearRangeSelect.tsx";

const API_BASE = API_CONFIG.baseUrl;

export function SimulationPanel() {
  const active = useActiveCategory((s) => s.active);
  const view = RANKING_VIEWS[active];
  const selected = useSelectedImpactEvent((s) => s.selected);
  const setSelected = useSelectedImpactEvent((s) => s.setSelected);

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
      <div className="sim-panel__head">
        <h2 className="sim-panel__title">{view.title}</h2>
        <YearRangeSelect />
      </div>
      <p className="sim-panel__subtitle">{view.subtitle}</p>

      <div className="sim-panel__list">
        {loading && <span className="sim-panel__hint">Loading...</span>}
        {error && <span className="sim-panel__hint">Error: {error}</span>}
        {!loading && !error && events.length === 0 && (
          <span className="sim-panel__hint">No data available yet.</span>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="risk-head">
            <span className="risk-head__rank" />
            <span className="risk-head__name">Impact Event</span>
            <span className="risk-head__score">{view.metricLabel}</span>
            <span className="risk-head__date">{view.metricLabel2}</span>
          </div>
        )}
        {events.map((event, index) => (
          <button
            key={event.impact_event_id}
            type="button"
            className={`risk-row${event.impact_event_id === selected?.impact_event_id ? ' is-selected' : ''}`}
            onClick={() => setSelected(event)}
          >
            <span className="risk-row__rank">{index + 1}</span>
            <span className="risk-row__name">{event.asteroid.name}</span>
            <span className="risk-row__score">{view.metric(event)}</span>
            <span className="risk-row__date">{view.metric2(event)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}