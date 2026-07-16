import { ImpactEventDetailCard } from './ImpactEventDetailCard';
import { AsteroidDetailCard } from './AsteroidDetailCard';
import { useSelectedImpactEvent } from './selectedImpactEvent.store';
import { useSelectedAsteroid } from './selectedAsteroid.store';

export function AsteroidViewer() {
  const selectedEvent = useSelectedImpactEvent((s) => s.selected);
  const selectedAsteroid = useSelectedAsteroid((s) => s.asteroid);

  return (
    <div className="asteroid-viewer">
      {!selectedEvent && selectedAsteroid ? <AsteroidDetailCard /> : <ImpactEventDetailCard />}
    </div>
  );
}

