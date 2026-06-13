import { useActiveCategory } from './category.store';
import { AsteroidTable } from './AsteroidTable';
import { ASTEROID_TABS } from './tabs.config';
import type { Asteroid } from '../../shared/api/types';

export function AsteroidTablesPanel() {
  const active = useActiveCategory((s) => s.active);
  const activeLabel = ASTEROID_TABS.find((tab) => tab.id === active)?.label;

  const rows: Asteroid[] = [];

  return (
    <div className="tables-panel">
      <div className="tables-panel__header">
        <span className="tables-panel__title">{activeLabel}</span>
      </div>
      <AsteroidTable rows={rows} />
    </div>
  );
}