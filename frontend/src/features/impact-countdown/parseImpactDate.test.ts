import { describe, it, expect } from 'vitest';
import { parseImpactDate, getCountdown } from './parseImpactDate';

describe('parseImpactDate', () => {
  it('returns null for empty input', () => {
    expect(parseImpactDate('')).toBeNull();
  });

  it('parses a full calendar date at UTC midnight', () => {
    const date = parseImpactDate('2056-03-16');
    expect(date).not.toBeNull();
    expect(date!.toISOString()).toBe('2056-03-16T00:00:00.000Z');
  });

  it('applies the fractional day component', () => {
    // .5 of a day == 12 hours past midnight.
    const date = parseImpactDate('2056-03-16.5');
    expect(date!.toISOString()).toBe('2056-03-16T12:00:00.000Z');
  });

  it('takes the first year of a year range', () => {
    const date = parseImpactDate('2056-2113');
    expect(date!.toISOString()).toBe('2056-01-01T00:00:00.000Z');
  });

  it('parses a bare year to Jan 1st UTC', () => {
    const date = parseImpactDate('2056');
    expect(date!.toISOString()).toBe('2056-01-01T00:00:00.000Z');
  });

  it('trims surrounding whitespace', () => {
    const date = parseImpactDate('  2056-03-16  ');
    expect(date!.toISOString()).toBe('2056-03-16T00:00:00.000Z');
  });

  it('returns null for unparseable garbage', () => {
    expect(parseImpactDate('not-a-date')).toBeNull();
  });
});

describe('getCountdown', () => {
  it('breaks down a future difference into buckets', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');
    // 1 day, 2 hours, 3 minutes, 4 seconds ahead.
    const target = new Date('2025-01-02T02:03:04.000Z');

    const result = getCountdown(target, now);

    expect(result).toEqual({
      years: 0,
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      isPast: false,
    });
  });

  it('counts full years (365-day years)', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');
    const target = new Date('2027-01-01T00:00:00.000Z');

    const result = getCountdown(target, now);

    // 730 days between the two dates / 365 == exactly 2 counting-years.
    expect(result.years).toBe(2);
    expect(result.days).toBe(0);
    expect(result.isPast).toBe(false);
  });

  it('flags a target in the past', () => {
    const now = new Date('2025-01-02T00:00:00.000Z');
    const target = new Date('2025-01-01T00:00:00.000Z');

    const result = getCountdown(target, now);

    expect(result.isPast).toBe(true);
    expect(result.days).toBe(1);
  });

  it('treats an equal instant as past', () => {
    const instant = new Date('2025-01-01T00:00:00.000Z');
    expect(getCountdown(instant, instant).isPast).toBe(true);
  });
});

