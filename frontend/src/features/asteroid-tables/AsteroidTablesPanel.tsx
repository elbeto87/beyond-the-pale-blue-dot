import { useEffect, useState } from 'react';
import { useActiveCategory } from './category.store';
import { AsteroidTable } from './AsteroidTable';
import { ASTEROID_TABS } from './tabs.config';
import { useSelectedAsteroid } from '../viewer/selectedAsteroid.store';
import { fetchAsteroids, fetchAsteroidByName } from '../../shared/api/asteroids';
import type { Asteroid } from '../../shared/api/types';

export function AsteroidTablesPanel() {
  const active = useActiveCategory((s) => s.active);
  const activeLabel = ASTEROID_TABS.find((tab) => tab.id === active)?.label;
  const selected = useSelectedAsteroid((s) => s.selected);
  const setSelected = useSelectedAsteroid((s) => s.setSelected);

  const [rows, setRows] = useState<Asteroid[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchAsteroids()
      .then((data) => {
        if (isMounted) {
          setRows(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRows([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = async (asteroid: Asteroid) => {
    setSelected(asteroid);
    try {
      const detailed = await fetchAsteroidByName(asteroid.name);
      setSelected(detailed);
    } catch {
      // Keep the basic selection if the detailed fetch fails.
    }
  };

  return (
    <div className="tables-panel">
      <div className="tables-panel__header">
        <span className="tables-panel__title">{activeLabel}</span>
      </div>
      <AsteroidTable rows={rows} selectedId={selected?.asteroid_id ?? null} onSelect={handleSelect} />
    </div>
  );
}