import { useEffect, useState } from 'react';
import type { Exoplanet } from '../../shared/api/types';
import { fetchLatestExoplanetDiscoveries } from '../../shared/api/exoplanet';
import { useSelectedExoplanet } from './selectedExoplanet.store';

/**
 * Left sidebar for the exoplanet view. Mirrors the asteroid simulation panel
 * structure so both pages share the same layout and cosmetics. Lists the ten
 * most recently discovered exoplanets, sorted by discovery year.
 */
export function ExoplanetPanel() {
  const selected = useSelectedExoplanet((s) => s.exoplanet);
  const setExoplanet = useSelectedExoplanet((s) => s.setExoplanet);

  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLatestExoplanetDiscoveries(10)
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
  }, []);

  return (
    <div className="sim-panel">
      <div className="sim-panel__head">
        <h2 className="sim-panel__title">LATEST DISCOVERIES</h2>
      </div>
      <p className="sim-panel__subtitle">The ten most recently discovered exoplanets.</p>

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
            <span className="risk-head__score">Year</span>
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
            <span className="risk-row__score">{exoplanet.discovery_year ?? '—'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

