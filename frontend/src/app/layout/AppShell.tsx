import { Toolbar } from './Toolbar';
import { AsteroidViewer } from '../../features/viewer/AsteroidViewer';
import { AsteroidTablesPanel } from '../../features/asteroid-tables/AsteroidTablesPanel';
import { SimulationPanel } from '../../features/simulation-panel/SimulationPanel';

export function AppShell() {
  return (
    <div className="app-shell">
      <Toolbar />
      <main className="app-shell__body">
        <section className="app-shell__viewer">
          <AsteroidViewer />
          <AsteroidTablesPanel />
        </section>
        <aside className="app-shell__sidebar">
          <SimulationPanel />
        </aside>
      </main>
    </div>
  );
}