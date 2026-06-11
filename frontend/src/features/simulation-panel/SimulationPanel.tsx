export function SimulationPanel() {
  return (
    <div className="sim-panel">
      <h2 className="sim-panel__title">SIMULATION PLATFORM</h2>
      <p className="sim-panel__subtitle">
        Seleccioná un asteroide para simular el impacto contra la Tierra.
      </p>

      <div className="sim-panel__list">
        <span className="sim-panel__hint">Sin datos disponibles todavía.</span>
      </div>
    </div>
  );
}