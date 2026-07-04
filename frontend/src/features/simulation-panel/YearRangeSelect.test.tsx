import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YearRangeSelect } from './YearRangeSelect';
import { YEAR_RANGE_OPTIONS } from './yearRange.config';
import { useYearRange } from './yearRange.store';

describe('<YearRangeSelect />', () => {
  beforeEach(() => {
    useYearRange.setState({ years: 100 });
  });

  it('renders one option per configured range', () => {
    render(<YearRangeSelect />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(YEAR_RANGE_OPTIONS.length);
    expect(options.map((o) => o.textContent)).toEqual(
      YEAR_RANGE_OPTIONS.map((o) => o.label),
    );
  });

  it('reflects the current store value', () => {
    useYearRange.setState({ years: 20 });
    render(<YearRangeSelect />);
    expect(screen.getByRole('combobox')).toHaveValue('20');
  });

  it('writes the selected value back to the store', async () => {
    const user = userEvent.setup();
    render(<YearRangeSelect />);

    await user.selectOptions(screen.getByRole('combobox'), '10');

    expect(useYearRange.getState().years).toBe(10);
    expect(screen.getByRole('combobox')).toHaveValue('10');
  });
});

