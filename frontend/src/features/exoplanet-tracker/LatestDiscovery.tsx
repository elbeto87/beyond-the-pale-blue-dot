import { useEffect, useState } from 'react';
import type { Exoplanet } from '../../shared/api/types';
import { fetchLatestExoplanetDiscoveries } from '../../shared/api/exoplanet';
import { useSelectedExoplanet } from './selectedExoplanet.store';

/**
 * Toolbar badge mirroring the "Most Lethal Impact" countdown, but for the
 * exoplanet view: shows the most recently discovered exoplanet (highest
 * discovery year; ties resolved by backend/table order). Clicking it opens
 * the exoplanet data sheet.
 */
export function LatestDiscovery() {
  const setExoplanet = useSelectedExoplanet((s) => s.setExoplanet);
  const [exoplanet, setLatest] = useState<Exoplanet | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestExoplanetDiscoveries(1)
      .then((data) => {
        if (!cancelled) setLatest(data[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setLatest(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!exoplanet) {
    return null;
  }

  return (
    <button
      type="button"
      className="impact-countdown impact-countdown--exo"
      onClick={() => setExoplanet(exoplanet)}
      title={`View exoplanet ${exoplanet.name}`}
    >
      <span className="impact-countdown__siren impact-countdown__siren--exo" aria-hidden="true">
        <span className="impact-countdown__siren-light impact-countdown__siren-light--exo" />
      </span>
      <span className="impact-countdown__body">
        <span className="impact-countdown__label impact-countdown__label--exo">
          LATEST EXOPLANET DISCOVERED
        </span>
        <span className="impact-countdown__time">
          <span className="impact-countdown__unit">{exoplanet.name}</span>
          {exoplanet.discovery_year != null && (
            <span className="impact-countdown__clock impact-countdown__clock--exo">
              {exoplanet.discovery_year}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

