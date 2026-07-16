import { useEffect, useRef, useState } from 'react';
import type { Asteroid } from '../../shared/api/types';
import { fetchImpactEventsByAsteroid, searchAsteroids } from '../../shared/api/asteroid';
import { useSelectedImpactEvent } from '../viewer/selectedImpactEvent.store';
import { useSelectedAsteroid } from '../viewer/selectedAsteroid.store';

/**
 * Search box that queries the backend for asteroids by name and shows the
 * matching results in a dropdown. Lives next to the category tabs.
 */
export function AsteroidSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Asteroid[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setSelectedEvent = useSelectedImpactEvent((s) => s.setSelected);
  const setSelectedAsteroid = useSelectedAsteroid((s) => s.setAsteroid);

  // Debounced search whenever the query changes.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      searchAsteroids(term)
        .then((data) => {
          if (cancelled) return;
          setResults(data);
          setOpen(true);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close the dropdown when clicking outside the component.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When an asteroid is picked, fetch all of its potential impact events and
  // show the asteroid data sheet, whose impact dates link to each event card.
  async function handleSelect(asteroid: Asteroid) {
    setQuery(asteroid.name);
    setSelectingId(asteroid.asteroid_id);
    try {
      const events = await fetchImpactEventsByAsteroid(asteroid.asteroid_id, 50);
      // Clear any previously selected event so the asteroid card is shown first.
      setSelectedEvent(null);
      setSelectedAsteroid(asteroid, events);
    } finally {
      setSelectingId(null);
      setOpen(false);
    }
  }

  return (
    <div className="asteroid-search" ref={containerRef}>
      <input
        type="text"
        className="asteroid-search__input"
        placeholder="Search an asteroid..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        aria-label="Search an asteroid"
      />

      {open && (
        <ul className="asteroid-search__results">
          {loading && <li className="asteroid-search__hint">Searching...</li>}
          {!loading && results.length === 0 && (
            <li className="asteroid-search__hint">No asteroids found.</li>
          )}
          {!loading &&
            results.map((asteroid) => (
              <li key={asteroid.asteroid_id}>
                <button
                  type="button"
                  className="asteroid-search__result"
                  disabled={selectingId === asteroid.asteroid_id}
                  onClick={() => handleSelect(asteroid)}
                >
                  <span className="asteroid-search__name">{asteroid.name}</span>
                  {asteroid.estimated_diameter != null && (
                    <span className="asteroid-search__meta">
                      ⌀ {asteroid.estimated_diameter.toFixed(2)} m
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

