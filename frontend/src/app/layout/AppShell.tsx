import { Toolbar } from './Toolbar';
import { AsteroidViewer } from '../../features/viewer/AsteroidViewer';
import { SimulationPanel } from '../../features/simulation-panel/SimulationPanel';
import { ExoplanetTracker } from '../../features/exoplanet-tracker/ExoplanetTracker';
import { ExoplanetPanel } from '../../features/exoplanet-tracker/ExoplanetPanel';
import { useTrackerMode } from '../tracker.store';

export function AppShell() {
  const mode = useTrackerMode((s) => s.mode);

  return (
    <div className="app-shell">
      <Toolbar />
      <main className="app-shell__body">
        <aside className="app-shell__sidebar">
          {mode === 'asteroid' ? <SimulationPanel /> : <ExoplanetPanel />}
        </aside>
        <section className="app-shell__viewer">
          {mode === 'asteroid' ? <AsteroidViewer /> : <ExoplanetTracker />}
        </section>
      </main>
    </div>
  );
}