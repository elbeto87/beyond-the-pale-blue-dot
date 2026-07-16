import { useSelectedAsteroid } from './selectedAsteroid.store';
import { useSelectedImpactEvent } from './selectedImpactEvent.store';

/**
 * Data sheet shown when an asteroid is picked from the search box. The title is
 * the asteroid name and every potential impact date is a link that opens the
 * matching impact-event data sheet.
 */
export function AsteroidDetailCard() {
  const asteroid = useSelectedAsteroid((s) => s.asteroid);
  const events = useSelectedAsteroid((s) => s.events);
  const setSelectedEvent = useSelectedImpactEvent((s) => s.setSelected);

  if (!asteroid) {
    return null;
  }

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <span className="detail-card__eyebrow">ASTEROID NAME</span>
        <h3 className="detail-card__name">{asteroid.name}</h3>
      </div>

      <div className="detail-card__section">
        <span className="detail-card__section-title">Potential impact dates</span>
        {events.length === 0 ? (
          <span className="detail-card__hint">No impact events registered for this asteroid.</span>
        ) : (
          <ul className="impact-date-list">
            {events.map((event) => (
              <li key={event.impact_event_id}>
                <button
                  type="button"
                  className="impact-date-list__link"
                  onClick={() => setSelectedEvent(event)}
                >
                  <span className="impact-date-list__date">{event.date}</span>
                  <span className="impact-date-list__meta">
                    {(event.impact_probability * 100).toFixed(4)} %
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

