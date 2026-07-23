import { ASTEROID_TABS } from '../../features/asteroid-tables/tabs.config';
import { useActiveCategory } from '../../features/asteroid-tables/category.store';
import { AsteroidSearch } from '../../features/asteroid-tables/AsteroidSearch';
import { ExoplanetSearch } from '../../features/exoplanet-tracker/ExoplanetSearch';
import { EXOPLANET_TABS } from '../../features/exoplanet-tracker/tabs.config';
import { useActiveExoplanetCategory } from '../../features/exoplanet-tracker/category.store';
import { LatestDiscovery } from '../../features/exoplanet-tracker/LatestDiscovery';
import { ImpactCountdown } from '../../features/impact-countdown/ImpactCountdown';
import { useTrackerMode } from '../tracker.store';
import { TrackerSwitch } from './TrackerSwitch';

export function Toolbar() {
  const active = useActiveCategory((s) => s.active);
  const setActive = useActiveCategory((s) => s.setActive);
  const activeExoplanet = useActiveExoplanetCategory((s) => s.active);
  const setActiveExoplanet = useActiveExoplanetCategory((s) => s.setActive);
  const mode = useTrackerMode((s) => s.mode);

  return (
    <header className="toolbar">
      <div className="toolbar__identity">
        <span className="toolbar__brand">BEYOND&nbsp;THE&nbsp;PALE&nbsp;BLUE&nbsp;DOT</span>
        <TrackerSwitch />
      </div>
      {mode === 'asteroid' ? (
        <div className="toolbar__controls">
          <div className="toolbar__controls-top">
            <ImpactCountdown />
          </div>
          <div className="toolbar__controls-bottom">
            <nav className="toolbar__tabs">
              {ASTEROID_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`toolbar__tab ${active === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActive(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <AsteroidSearch />
          </div>
        </div>
      ) : (
        <div className="toolbar__controls">
          <div className="toolbar__controls-top">
            <LatestDiscovery />
          </div>
          <div className="toolbar__controls-bottom">
            <nav className="toolbar__tabs">
              {EXOPLANET_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`toolbar__tab ${activeExoplanet === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActiveExoplanet(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <ExoplanetSearch />
          </div>
        </div>
      )}
    </header>
  );
}