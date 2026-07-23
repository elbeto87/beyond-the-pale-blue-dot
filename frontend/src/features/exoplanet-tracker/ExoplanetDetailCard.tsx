import { useSelectedExoplanet } from './selectedExoplanet.store';

function formatValue(value: number | string | null, unit = ''): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return `${Number.isInteger(value) ? value : value.toLocaleString('en-US', { maximumFractionDigits: 4 })}${unit}`;
  }
  return `${value}${unit}`;
}

/**
 * Data sheet shown when an exoplanet is picked from the search box. The title
 * is the exoplanet name followed by its physical and orbital properties.
 */
export function ExoplanetDetailCard() {
  const exoplanet = useSelectedExoplanet((s) => s.exoplanet);

  if (!exoplanet) {
    return null;
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Host star', value: formatValue(exoplanet.host_name) },
    { label: 'Discovery year', value: formatValue(exoplanet.discovery_year) },
    { label: 'Discovery method', value: formatValue(exoplanet.discovery_method) },
    { label: 'Radius', value: formatValue(exoplanet.radius, ' R⊕') },
    { label: 'Mass', value: formatValue(exoplanet.mass, ' M⊕') },
    { label: 'Density', value: formatValue(exoplanet.density, ' g/cm³') },
    { label: 'Temperature', value: formatValue(exoplanet.temperature, ' K') },
    { label: 'Insolation', value: formatValue(exoplanet.insolation, ' S⊕') },
    { label: 'Orbital period', value: formatValue(exoplanet.orbit_period, ' days') },
    { label: 'Orbital eccentricity', value: formatValue(exoplanet.orbit_eccentricity) },
    { label: 'Semi-major axis', value: formatValue(exoplanet.orbit_smax, ' AU') },
    { label: 'Star temperature', value: formatValue(exoplanet.star_temperature, ' K') },
  ];

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <span className="detail-card__eyebrow">EXOPLANET</span>
        <h3 className="detail-card__name">{exoplanet.name}</h3>
      </div>

      <dl className="detail-card__grid">
        {rows.map((row) => (
          <div key={row.label} className="detail-card__row">
            <dt className="detail-card__label">{row.label}</dt>
            <dd className="detail-card__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

