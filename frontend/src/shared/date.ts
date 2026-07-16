/**
 * Formats an impact `date` coming from the JPL Sentry data set into a clean
 * calendar date (YYYY-MM-DD).
 *
 * Sentry dates may carry a fractional day (e.g. "2101-03-16.07", where ".07" is
 * a fraction of the day), or be a bare year / year range. We only surface the
 * calendar portion; anything that is not a full date is returned untouched.
 */
export function formatImpactDate(raw: string): string {
  if (!raw) return raw;
  const value = raw.trim();
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : value;
}

