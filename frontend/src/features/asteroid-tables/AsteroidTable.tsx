import type { Asteroid } from '../../shared/api/types';

interface Props {
  rows: Asteroid[];
}

const COLUMNS = [
  { key: 'name', label: 'Nombre' },
  { key: 'estimated_diameter', label: 'Diámetro (km)' },
  { key: 'absolute_magnitude_h', label: 'Magnitud (H)' },
] as const;

export function AsteroidTable({ rows }: Props) {
  if (rows.length === 0) {
    return <div className="table__state">Sin datos todavía</div>;
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
          <tr key={asteroid.asteroid_id}>
            {COLUMNS.map((column) => (
              <td key={column.key}>{String(asteroid[column.key] ?? '—')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}