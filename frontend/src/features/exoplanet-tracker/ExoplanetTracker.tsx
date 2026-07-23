import { ExoplanetDetailCard } from './ExoplanetDetailCard';
import { useSelectedExoplanet } from './selectedExoplanet.store';

/**
 * Viewer area for the exoplanet view. Mirrors AsteroidViewer: shows the
 * selected exoplanet data sheet, or an empty-state hint.
 */
export function ExoplanetTracker() {
  const exoplanet = useSelectedExoplanet((s) => s.exoplanet);

  return (
    <div className="asteroid-viewer">
      {exoplanet ? (
        <ExoplanetDetailCard />
      ) : (
        <div className="detail-card detail-card--empty">
          <span className="detail-card__hint">Search an exoplanet to see its data sheet.</span>
        </div>
      )}
    </div>
  );
}

