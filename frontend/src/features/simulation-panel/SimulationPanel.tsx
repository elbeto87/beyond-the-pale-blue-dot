import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

interface ImpactEvent {
  impact_event_id: string;
  asteroid: { asteroid_id: string; name: string; estimated_diameter: number | null };
  date: string;
  impact_probability: number;
  energy: number;
  dangerous_score: number;
}

export function SimulationPanel() {
  const [events, setEvents] = useState<ImpactEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/impact_event/top_by_risk?count=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ImpactEvent[]) => setEvents(data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sim-panel">
      <h2 className="sim-panel__title">MOST DANGEROUS</h2>
      <p className="sim-panel__subtitle">
        Top 10 most dangerous asteroids based on the impact risk.
      </p>

      <div className="sim-panel__list">
        {loading && <span className="sim-panel__hint">Loading...</span>}
        {error && <span className="sim-panel__hint">Error: {error}</span>}
        {!loading && !error && events.length === 0 && (
          <span className="sim-panel__hint">No data available yet.</span>
        )}
        {events.map((event, index) => (
          <div key={event.impact_event_id} className="risk-row">
            <span className="risk-row__rank">{index + 1}</span>
            <span className="risk-row__name">{event.asteroid.name}</span>
            <span className="risk-row__score">{event.dangerous_score.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
