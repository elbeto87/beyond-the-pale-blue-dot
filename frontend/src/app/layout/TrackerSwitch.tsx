import { TRACKER_MODES, useTrackerMode } from '../tracker.store';

export function TrackerSwitch() {
  const mode = useTrackerMode((s) => s.mode);
  const setMode = useTrackerMode((s) => s.setMode);

  const activeIndex = TRACKER_MODES.findIndex((m) => m.id === mode);

  return (
    <div
      className="tracker-switch"
      role="tablist"
      aria-label="Tracker mode"
      data-active={mode}
    >
      <span
        className="tracker-switch__thumb"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />
      {TRACKER_MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          className={`tracker-switch__option ${mode === m.id ? 'is-active' : ''}`}
          onClick={() => setMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

