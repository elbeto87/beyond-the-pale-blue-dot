import { Toolbar } from './Toolbar';
import { EarthViewer } from '../../features/viewer/EarthViewer';
import { AsteroidTablesPanel } from '../../features/asteroid-tables/AsteroidTablesPanel';
import { SimulationPanel } from '../../features/simulation-panel/SimulationPanel';

export function AppShell() {
  return (
    <div className="app-shell">
      <Toolbar />
      <main className="app-shell__body">
        <section className="app-shell__viewer">
          <EarthViewer />
          <AsteroidTablesPanel />
        </section>
        <aside className="app-shell__sidebar">
          <SimulationPanel />
        </aside>
      </main>
    </div>
  );
}