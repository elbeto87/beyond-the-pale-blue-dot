import { describe, it, expect, beforeEach } from 'vitest';
import { useYearRange } from './yearRange.store';

describe('useYearRange store', () => {
  beforeEach(() => {
    // Reset to the documented default before each test.
    useYearRange.setState({ years: 100 });
  });

  it('starts at 100 years by default', () => {
    expect(useYearRange.getState().years).toBe(100);
  });

  it('updates the range through setYears', () => {
    useYearRange.getState().setYears(20);
    expect(useYearRange.getState().years).toBe(20);
  });

  it('overwrites the previous value on repeated calls', () => {
    const { setYears } = useYearRange.getState();
    setYears(10);
    setYears(50);
    expect(useYearRange.getState().years).toBe(50);
  });
});

