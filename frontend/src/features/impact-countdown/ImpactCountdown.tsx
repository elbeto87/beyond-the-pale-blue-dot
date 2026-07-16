import { useEffect, useMemo, useState } from 'react';
import type { ImpactEvent } from '../../shared/api/types';
import { API_CONFIG } from '../../shared/api/config';
import { fetchWithCache } from '../../shared/api/cache';
import { useSelectedImpactEvent } from '../viewer/selectedImpactEvent.store';
import { useSelectedAsteroid } from '../viewer/selectedAsteroid.store';
import { getCountdown, parseImpactDate } from './parseImpactDate';

const API_BASE = API_CONFIG.baseUrl;

// The single most dangerous impact event (currently "1979 XB").
const TOP_RISK_URL = `${API_BASE}/impact_event/top_by_risk?count=1&time_range=100`;

const pad = (n: number) => String(n).padStart(2, '0');

export function ImpactCountdown() {
  const setSelected = useSelectedImpactEvent((s) => s.setSelected);
  const clearAsteroid = useSelectedAsteroid((s) => s.clear);

  const [event, setEvent] = useState<ImpactEvent | null>(null);
  const [now, setNow] = useState(() => new Date());

  // Fetch the top risk impact event once.
  useEffect(() => {
    let cancelled = false;
    fetchWithCache<ImpactEvent[]>(TOP_RISK_URL)
      .then((data) => {
        if (!cancelled) setEvent(data[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setEvent(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Tick every second so the countdown stays live.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = useMemo(() => (event ? parseImpactDate(event.date) : null), [event]);

  if (!event || !target) {
    return null;
  }

  const { years, days, hours, minutes, seconds, isPast } = getCountdown(target, now);

  return (
    <button
      type="button"
      className="impact-countdown"
      onClick={() => {
        clearAsteroid();
        setSelected(event);
      }}
      title={`View impact event ${event.asteroid.name}`}
    >
      <span className="impact-countdown__siren" aria-hidden="true">
        <span className="impact-countdown__siren-light" />
      </span>
      <span className="impact-countdown__body">
        <span className="impact-countdown__label">
          {isPast ? 'IMPACT ELAPSED' : 'MOST LETHAL IMPACT EVENT IN'}
        </span>
        <span className="impact-countdown__time">
          {years > 0 && <span className="impact-countdown__unit">{years}y</span>}
          {(years > 0 || days > 0) && <span className="impact-countdown__unit">{days}d</span>}
          <span className="impact-countdown__clock">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>
        </span>
      </span>
    </button>
  );
}

