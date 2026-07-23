import { ExoplanetDetailCard } from './ExoplanetDetailCard';
import { ExoplanetScene } from './scene/ExoplanetScene';
import { useSelectedExoplanet } from './selectedExoplanet.store';

/**
 * Viewer area for the exoplanet view. Renders a 3D representation of the
 * selected exoplanet (color from temperature, rocky/gaseous look from
 * density/mass/radius) with its data sheet as a side panel, or an
 * empty-state hint when nothing is selected.
 */
export function ExoplanetTracker() {
  const exoplanet = useSelectedExoplanet((s) => s.exoplanet);

  return (
    <div className="asteroid-viewer">
      {exoplanet ? (
        <>
          <div className="exoplanet-scene">
            <ExoplanetScene exoplanet={exoplanet} />
          </div>
          <ExoplanetDetailCard />
        </>
      ) : (
        <div className="detail-card detail-card--empty">
          <span className="detail-card__hint">Search an exoplanet to see its data sheet.</span>
        </div>
      )}
    </div>
  );
}

