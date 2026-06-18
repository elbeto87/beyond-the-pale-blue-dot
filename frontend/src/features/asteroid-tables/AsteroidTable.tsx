import type { Asteroid } from '../../shared/api/types';

interface Props {
  rows: Asteroid[];
  selectedId?: string | null;
  onSelect?: (asteroid: Asteroid) => void;
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'estimated_diameter', label: 'Diameter (km)' },
  { key: 'absolute_magnitude_h', label: 'Magnitude (H)' },
] as const;

export function AsteroidTable({ rows, selectedId, onSelect }: Props) {
  if (rows.length === 0) {
    return <div className="table__state">No data available yet.</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((asteroid) => (
          <tr
            key={asteroid.asteroid_id}
            className={`table__row${asteroid.asteroid_id === selectedId ? ' is-selected' : ''}`}
            onClick={() => onSelect?.(asteroid)}
          >
            {COLUMNS.map((column) => (
              <td key={column.key}>{String(asteroid[column.key] ?? '—')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}