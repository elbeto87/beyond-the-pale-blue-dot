import { useEffect, useState } from 'react';
import type { Exoplanet } from '../../shared/api/types';
import {
  fetchHabitableExoplanetDiscoveries,
  fetchLatestExoplanetDiscoveries,
} from '../../shared/api/exoplanet';
import { useSelectedExoplanet } from './selectedExoplanet.store';
import { useActiveExoplanetCategory } from './category.store';
import { ExoplanetAdvancedSearchPanel } from './ExoplanetAdvancedSearchPanel';

/**
 * Left sidebar for the exoplanet view. Mirrors the asteroid simulation panel
 * structure so both pages share the same layout and cosmetics. Lists either
 * the ten most recently discovered exoplanets or the potentially habitable
 * ones, depending on the active toolbar tab. When the "ADVANCED SEARCH" tab
 * is active, renders the advanced search panel instead.
 */
export function ExoplanetPanel() {
  const selected = useSelectedExoplanet((s) => s.exoplanet);
  const setExoplanet = useSelectedExoplanet((s) => s.setExoplanet);
  const category = useActiveExoplanetCategory((s) => s.active);

  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isHabitable = category === 'habitable';
  const isAdvanced = category === 'advanced';

  useEffect(() => {
    if (isAdvanced) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const request = isHabitable
      ? fetchHabitableExoplanetDiscoveries(1000)
      : fetchLatestExoplanetDiscoveries(10);
    request
      .then((data) => {
        if (!cancelled) setExoplanets(data);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isHabitable, isAdvanced]);

  if (isAdvanced) {
    return <ExoplanetAdvancedSearchPanel />;
  }

  return (
    <div className="sim-panel">
      <div className="sim-panel__head">
        <h2 className="sim-panel__title">
          {isHabitable ? 'POTENTIALLY HABITABLE' : 'LATEST DISCOVERIES'}
        </h2>
      </div>
      <p className="sim-panel__subtitle">
        {isHabitable
          ? 'Exoplanets with Earth-like radius and insolation, sorted by discovery date.'
          : 'The ten most recently discovered exoplanets.'}
      </p>

      <div className="sim-panel__list">
        {loading && <span className="sim-panel__hint">Loading...</span>}
        {error && <span className="sim-panel__hint">Error: {error}</span>}
        {!loading && !error && exoplanets.length === 0 && (
          <span className="sim-panel__hint">No data available yet.</span>
        )}
        {!loading && !error && exoplanets.length > 0 && (
          <div className="risk-head risk-head--exo">
            <span className="risk-head__rank" />
            <span className="risk-head__name">Exoplanet Name</span>
            <span className="risk-head__score">Discovered</span>
          </div>
        )}
        {exoplanets.map((exoplanet, index) => (
          <button
            key={exoplanet.name}
            type="button"
            className={`risk-row risk-row--exo${exoplanet.name === selected?.name ? ' is-selected' : ''}`}
            onClick={() => setExoplanet(exoplanet)}
          >
            <span className="risk-row__rank">{index + 1}</span>
            <span className="risk-row__name">{exoplanet.name}</span>
            <span className="risk-row__score">
              {exoplanet.discovery_pubdate ?? exoplanet.discovery_year ?? '—'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

