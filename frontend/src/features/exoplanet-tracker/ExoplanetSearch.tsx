import { useEffect, useRef, useState } from 'react';
import type { Exoplanet } from '../../shared/api/types';
import { searchExoplanets } from '../../shared/api/exoplanet';
import { useSelectedExoplanet } from './selectedExoplanet.store';

/**
 * Search box that queries the backend for exoplanets by name and shows the
 * matching results in a dropdown. Lives in the toolbar when the exoplanet
 * tracker is active.
 */
export function ExoplanetSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Exoplanet[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setSelectedExoplanet = useSelectedExoplanet((s) => s.setExoplanet);

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
      searchExoplanets(term)
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

  // When an exoplanet is picked, show its data sheet.
  function handleSelect(exoplanet: Exoplanet) {
    setQuery(exoplanet.name);
    setSelectedExoplanet(exoplanet);
    setOpen(false);
  }

  return (
    <div className="asteroid-search" ref={containerRef}>
      <input
        type="text"
        className="asteroid-search__input"
        placeholder="Search an exoplanet..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        aria-label="Search an exoplanet"
      />

      {open && (
        <ul className="asteroid-search__results">
          {loading && <li className="asteroid-search__hint">Searching...</li>}
          {!loading && results.length === 0 && (
            <li className="asteroid-search__hint">No exoplanets found.</li>
          )}
          {!loading &&
            results.map((exoplanet) => (
              <li key={exoplanet.name}>
                <button
                  type="button"
                  className="asteroid-search__result"
                  onClick={() => handleSelect(exoplanet)}
                >
                  <span className="asteroid-search__name">{exoplanet.name}</span>
                  {exoplanet.discovery_year != null && (
                    <span className="asteroid-search__meta">{exoplanet.discovery_year}</span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

