import { YEAR_RANGE_OPTIONS } from './yearRange.config';
import { useYearRange } from './yearRange.store';

export function YearRangeSelect() {
  const years = useYearRange((s) => s.years);
  const setYears = useYearRange((s) => s.setYears);

  return (
    <label className="year-select">
      <span className="year-select__label">RANGE</span>
      <select
        className="year-select__field"
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
      >
        {YEAR_RANGE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}