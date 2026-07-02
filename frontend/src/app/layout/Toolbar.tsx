import { ASTEROID_TABS } from '../../features/asteroid-tables/tabs.config';
import { useActiveCategory } from '../../features/asteroid-tables/category.store';
import { ImpactCountdown } from '../../features/impact-countdown/ImpactCountdown';

export function Toolbar() {
  const active = useActiveCategory((s) => s.active);
  const setActive = useActiveCategory((s) => s.setActive);

  return (
    <header className="toolbar">
      <span className="toolbar__brand">THE&nbsp;END&nbsp;OF&nbsp;THE&nbsp;WORLD</span>
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
      <ImpactCountdown />
    </header>
  );
}