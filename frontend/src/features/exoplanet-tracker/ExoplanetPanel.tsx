/**
 * Left sidebar for the exoplanet view. Mirrors the asteroid simulation panel
 * structure so both pages share the same layout and cosmetics. Empty for now:
 * rankings/content will land here later.
 */
export function ExoplanetPanel() {
  return (
    <div className="sim-panel">
      <div className="sim-panel__head">
        <h2 className="sim-panel__title">EXOPLANET RANKINGS</h2>
      </div>
      <p className="sim-panel__subtitle">Worlds beyond the Solar System.</p>

      <div className="sim-panel__list">
        <span className="sim-panel__hint">No data available yet.</span>
      </div>
    </div>
  );
}

