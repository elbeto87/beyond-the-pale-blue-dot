import { Toolbar } from './Toolbar';
import { AsteroidViewer } from '../../features/viewer/AsteroidViewer';
import { SimulationPanel } from '../../features/simulation-panel/SimulationPanel';

export function AppShell() {
  return (
    <div className="app-shell">
      <Toolbar />
      <main className="app-shell__body">
        <aside className="app-shell__sidebar">
          <SimulationPanel />
        </aside>
        <section className="app-shell__viewer">
          <AsteroidViewer />
        </section>
      </main>
    </div>
  );
}