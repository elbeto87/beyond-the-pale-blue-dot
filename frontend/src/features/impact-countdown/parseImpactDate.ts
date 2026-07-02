/**
 * Parses the impact `date` string coming from the JPL Sentry data set into a
 * concrete JS `Date` that we can count down to.
 *
 * The Sentry field is not fully standardised, so we handle the common shapes:
 *  - "YYYY-MM-DD.ffff" (fractional day)   → resolve to that calendar instant
 *  - "YYYY-MM-DD"                          → midnight of that day
 *  - "YYYY-YYYY" (a year range)            → January 1st of the first year
 *  - "YYYY"                                → January 1st of that year
 *
 * Returns `null` when the string cannot be interpreted.
 */
export function parseImpactDate(raw: string): Date | null {
  if (!raw) return null;

  const value = raw.trim();

  // Full calendar date with an optional fractional day: 2056-03-16.61
  const fullMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:\.(\d+))?$/);
  if (fullMatch) {
    const [, year, month, day, frac] = fullMatch;
    const base = Date.UTC(Number(year), Number(month) - 1, Number(day));
    const fractionOfDay = frac ? Number(`0.${frac}`) : 0;
    return new Date(base + fractionOfDay * 24 * 60 * 60 * 1000);
  }

  // Year range ("2056-2113") or bare year ("2056"): take the first year.
  const yearMatch = value.match(/^(\d{4})/);
  if (yearMatch) {
    return new Date(Date.UTC(Number(yearMatch[1]), 0, 1));
  }

  // Last resort: let the runtime try to parse it.
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export interface Countdown {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/**
 * Breaks down the remaining time between `now` and `target` into calendar-ish
 * buckets (years / days / hours / minutes / seconds) for display.
 */
export function getCountdown(target: Date, now: Date = new Date()): Countdown {
  let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  const isPast = diff <= 0;
  diff = Math.abs(diff);

  const secondsPerYear = 365 * 24 * 60 * 60;
  const secondsPerDay = 24 * 60 * 60;

  const years = Math.floor(diff / secondsPerYear);
  diff -= years * secondsPerYear;
  const days = Math.floor(diff / secondsPerDay);
  diff -= days * secondsPerDay;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  return { years, days, hours, minutes, seconds, isPast };
}

