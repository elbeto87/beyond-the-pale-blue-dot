import { Toolbar } from './Toolbar';
import { AsteroidViewer } from '../../features/viewer/AsteroidViewer';
import { SimulationPanel } from '../../features/simulation-panel/SimulationPanel';
import { ExoplanetTracker } from '../../features/exoplanet-tracker/ExoplanetTracker';
import { useTrackerMode } from '../tracker.store';

export function AppShell() {
  const mode = useTrackerMode((s) => s.mode);

  return (
    <div className="app-shell">
      <Toolbar />
      {mode === 'asteroid' ? (
        <main className="app-shell__body">
          <aside className="app-shell__sidebar">
            <SimulationPanel />
          </aside>
          <section className="app-shell__viewer">
            <AsteroidViewer />
          </section>
        </main>
      ) : (
        <main className="app-shell__body app-shell__body--single">
          <ExoplanetTracker />
        </main>
      )}
    </div>
  );
}