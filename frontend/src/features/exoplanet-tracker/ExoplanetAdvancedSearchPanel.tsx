import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Exoplanet } from '../../shared/api/types';
import {
  advancedSearchExoplanets,
  fetchExoplanetDiscoveryMethods,
} from '../../shared/api/exoplanet';
import type { ExoplanetAdvancedFilters } from '../../shared/api/exoplanet';
import { DualRangeSlider } from '../../shared/ui/DualRangeSlider';
import { useSelectedExoplanet } from './selectedExoplanet.store';
const PLANET_TYPES = [
  { id: 'rocky', label: 'Rocky world' },
  { id: 'mini-neptune', label: 'Mini-Neptune' },
  { id: 'gas-giant', label: 'Gas giant' },
  { id: 'icy', label: 'Icy world' },
  { id: 'gaseous', label: 'Gaseous planet' },
] as const;
const MAX_RESULTS = 100;
const CURRENT_YEAR = new Date().getFullYear();
/** Slider domains (display units). Temperatures are edited in Celsius. */
const YEAR_DOMAIN = { min: 1992, max: CURRENT_YEAR };
const INSOLATION_DOMAIN = { min: 0.01, max: 100000 }; // S⊕, log scale
const PLANET_TEMP_DOMAIN = { min: -270, max: 4730 }; // °C (~3 K to ~5000 K)
const ORBIT_PERIOD_DOMAIN = { min: 0.1, max: 100000 }; // days, log scale
const STAR_TEMP_DOMAIN = { min: 1700, max: 30000 }; // °C (~2000 K to ~30273 K)
const celsiusToKelvin = (celsius: number): number => Math.round((celsius + 273.15) * 100) / 100;
const formatInt = (v: number) => String(Math.round(v));
const formatCelsius = (v: number) => `${Math.round(v).toLocaleString('en-US')} \u00B0C`;
const formatFlux = (v: number) =>
  `${v >= 1000 ? Math.round(v).toLocaleString('en-US') : v} S⊕`;
const formatDays = (v: number) =>
  `${v >= 1000 ? Math.round(v).toLocaleString('en-US') : v} d`;
type Range = [number, number];
/**
 * Left sidebar panel for the "ADVANCED SEARCH" tab. Every filter is a
 * min/max slider (no free-text input): discovery year, insolation,
 * equilibrium temperature (°C), orbital period and host star temperature
 * (°C), plus checkboxes for discovery method and planet type. Shows up to
 * 100 matching results. Sliders left at the domain ends are not sent as
 * filters, so untouched controls do not exclude planets with missing data.
 */
export function ExoplanetAdvancedSearchPanel() {
  const selected = useSelectedExoplanet((s) => s.exoplanet);
  const setExoplanet = useSelectedExoplanet((s) => s.setExoplanet);
  const [yearRange, setYearRange] = useState<Range>([YEAR_DOMAIN.min, YEAR_DOMAIN.max]);
  const [insolationRange, setInsolationRange] = useState<Range>([
    INSOLATION_DOMAIN.min,
    INSOLATION_DOMAIN.max,
  ]);
  const [tempRange, setTempRange] = useState<Range>([
    PLANET_TEMP_DOMAIN.min,
    PLANET_TEMP_DOMAIN.max,
  ]);
  const [orbitRange, setOrbitRange] = useState<Range>([
    ORBIT_PERIOD_DOMAIN.min,
    ORBIT_PERIOD_DOMAIN.max,
  ]);
  const [starTempRange, setStarTempRange] = useState<Range>([
    STAR_TEMP_DOMAIN.min,
    STAR_TEMP_DOMAIN.max,
  ]);
  // Checkbox groups. All options are selected by default.
  const [methods, setMethods] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(PLANET_TYPES.map((t) => t.id)),
  );
  const [results, setResults] = useState<Exoplanet[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Load the available discovery methods once.
  useEffect(() => {
    let cancelled = false;
    fetchExoplanetDiscoveryMethods()
      .then((data) => {
        if (cancelled) return;
        setMethods(data);
        setSelectedMethods(new Set(data));
      })
      .catch(() => {
        if (!cancelled) setMethods([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  function toggle(set: Set<string>, value: string): Set<string> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }
  /** Returns the bound only when the user moved the slider away from the domain end. */
  function bound(value: number, domainEnd: number): number | undefined {
    return value === domainEnd ? undefined : value;
  }
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const tempMin = bound(tempRange[0], PLANET_TEMP_DOMAIN.min);
    const tempMax = bound(tempRange[1], PLANET_TEMP_DOMAIN.max);
    const starMin = bound(starTempRange[0], STAR_TEMP_DOMAIN.min);
    const starMax = bound(starTempRange[1], STAR_TEMP_DOMAIN.max);
    const filters: ExoplanetAdvancedFilters = {
      yearMin: bound(yearRange[0], YEAR_DOMAIN.min),
      yearMax: bound(yearRange[1], YEAR_DOMAIN.max),
      insolationMin: bound(insolationRange[0], INSOLATION_DOMAIN.min),
      insolationMax: bound(insolationRange[1], INSOLATION_DOMAIN.max),
      // The API works in Kelvin; the UI shows Celsius.
      temperatureMin: tempMin != null ? celsiusToKelvin(tempMin) : undefined,
      temperatureMax: tempMax != null ? celsiusToKelvin(tempMax) : undefined,
      orbitPeriodMin: bound(orbitRange[0], ORBIT_PERIOD_DOMAIN.min),
      orbitPeriodMax: bound(orbitRange[1], ORBIT_PERIOD_DOMAIN.max),
      starTemperatureMin: starMin != null ? celsiusToKelvin(starMin) : undefined,
      starTemperatureMax: starMax != null ? celsiusToKelvin(starMax) : undefined,
      // Only send the checkbox filters when the user narrowed the selection.
      discoveryMethods:
        selectedMethods.size > 0 && selectedMethods.size < methods.length
          ? [...selectedMethods]
          : undefined,
      planetTypes:
        selectedTypes.size > 0 && selectedTypes.size < PLANET_TYPES.length
          ? [...selectedTypes]
          : undefined,
    };
    setLoading(true);
    setError(null);
    advancedSearchExoplanets(filters, MAX_RESULTS)
      .then((data) => setResults(data))
      .catch((err) => {
        setError(String(err));
        setResults(null);
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="sim-panel">
      <div className="sim-panel__head">
        <h2 className="sim-panel__title">ADVANCED SEARCH</h2>
      </div>
      <p className="sim-panel__subtitle">
        Filter the exoplanet catalog. Up to {MAX_RESULTS} results are shown.
      </p>
      <form className="adv-search" onSubmit={handleSubmit}>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Discovery year</legend>
          <DualRangeSlider
            min={YEAR_DOMAIN.min}
            max={YEAR_DOMAIN.max}
            valueMin={yearRange[0]}
            valueMax={yearRange[1]}
            onChange={(lo, hi) => setYearRange([lo, hi])}
            formatValue={formatInt}
            ariaLabel="Discovery year"
          />
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Discovery method</legend>
          <div className="adv-search__checks">
            {methods.length === 0 && <span className="sim-panel__hint">Loading methods...</span>}
            {methods.map((method) => (
              <label key={method} className="adv-search__check">
                <input
                  type="checkbox"
                  checked={selectedMethods.has(method)}
                  onChange={() => setSelectedMethods((prev) => toggle(prev, method))}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Insolation</legend>
          <DualRangeSlider
            min={INSOLATION_DOMAIN.min}
            max={INSOLATION_DOMAIN.max}
            scale="log"
            valueMin={insolationRange[0]}
            valueMax={insolationRange[1]}
            onChange={(lo, hi) => setInsolationRange([lo, hi])}
            formatValue={formatFlux}
            ariaLabel="Insolation"
          />
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Avg. temperature</legend>
          <DualRangeSlider
            min={PLANET_TEMP_DOMAIN.min}
            max={PLANET_TEMP_DOMAIN.max}
            step={10}
            valueMin={tempRange[0]}
            valueMax={tempRange[1]}
            onChange={(lo, hi) => setTempRange([lo, hi])}
            formatValue={formatCelsius}
            ariaLabel="Average temperature"
          />
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Orbital period</legend>
          <DualRangeSlider
            min={ORBIT_PERIOD_DOMAIN.min}
            max={ORBIT_PERIOD_DOMAIN.max}
            scale="log"
            valueMin={orbitRange[0]}
            valueMax={orbitRange[1]}
            onChange={(lo, hi) => setOrbitRange([lo, hi])}
            formatValue={formatDays}
            ariaLabel="Orbital period"
          />
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Host star temperature</legend>
          <DualRangeSlider
            min={STAR_TEMP_DOMAIN.min}
            max={STAR_TEMP_DOMAIN.max}
            step={100}
            valueMin={starTempRange[0]}
            valueMax={starTempRange[1]}
            onChange={(lo, hi) => setStarTempRange([lo, hi])}
            formatValue={formatCelsius}
            ariaLabel="Host star temperature"
          />
        </fieldset>
        <fieldset className="adv-search__group">
          <legend className="adv-search__legend">Planet type</legend>
          <div className="adv-search__checks">
            {PLANET_TYPES.map((type) => (
              <label key={type.id} className="adv-search__check">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type.id)}
                  onChange={() => setSelectedTypes((prev) => toggle(prev, type.id))}
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="adv-search__submit" disabled={loading}>
          {loading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </form>
      <div className="sim-panel__list">
        {error && <span className="sim-panel__hint">Error: {error}</span>}
        {!loading && !error && results != null && results.length === 0 && (
          <span className="sim-panel__hint">No exoplanets match the filters.</span>
        )}
        {!loading && !error && results != null && results.length > 0 && (
          <>
            <span className="sim-panel__hint">
              {results.length === MAX_RESULTS
                ? `Showing the first ${MAX_RESULTS} results.`
                : `${results.length} result${results.length === 1 ? '' : 's'} found.`}
            </span>
            <div className="risk-head risk-head--exo">
              <span className="risk-head__rank" />
              <span className="risk-head__name">Exoplanet Name</span>
              <span className="risk-head__score">Discovered</span>
            </div>
            {results.map((exoplanet, index) => (
              <button
                key={exoplanet.name}
                type="button"
                className={`risk-row risk-row--exo${exoplanet.name === selected?.name ? ' is-selected' : ''}`}
                onClick={() => setExoplanet(exoplanet)}
              >
                <span className="risk-row__rank">{index + 1}</span>
                <span className="risk-row__name">{exoplanet.name}</span>
                <span className="risk-row__score">
                  {exoplanet.discovery_pubdate ?? exoplanet.discovery_year ?? '—'}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
