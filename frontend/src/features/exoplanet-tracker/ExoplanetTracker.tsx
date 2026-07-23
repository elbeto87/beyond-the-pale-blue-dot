import { ExoplanetDetailCard } from './ExoplanetDetailCard';
import { useSelectedExoplanet } from './selectedExoplanet.store';

export function ExoplanetTracker() {
  const exoplanet = useSelectedExoplanet((s) => s.exoplanet);

  if (exoplanet) {
    return (
      <div className="exoplanet-tracker exoplanet-tracker--detail">
        <ExoplanetDetailCard />
      </div>
    );
  }

  return (
    <div className="exoplanet-tracker">
      <p className="exoplanet-tracker__eyebrow">EXOPLANET TRACKER</p>
      <h2 className="exoplanet-tracker__title">Coming soon</h2>
      <p className="exoplanet-tracker__hint">
        Worlds beyond the Solar System will be charted here.
      </p>
    </div>
  );
}

