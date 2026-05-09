/**
 * dateRangeUtils.js
 * Location: src/Components/DataTable/dateRangeUtils.js
 *
 * Pure utility functions for date range filtering.
 * Kept in a .js file (not .jsx) so Fast Refresh stays happy.
 */

/**
 * Filters rows by a date field within [startDate, endDate].
 * Compares YYYY-MM-DD strings lexicographically — no Date object needed.
 *
 * @param {object[]} rows
 * @param {string}   field      - row field name, e.g. "PurReceiveDate"
 * @param {string}   startDate  - "YYYY-MM-DD" or ""
 * @param {string}   endDate    - "YYYY-MM-DD" or ""
 * @returns {object[]}
 */
export function applyDateRange(rows, field, startDate, endDate) {
  if (!startDate && !endDate) return rows;

  return rows.filter((row) => {
    const d = row[field]?.slice(0, 10); // normalise to YYYY-MM-DD
    if (!d) return false;
    if (startDate && d < startDate) return false;
    if (endDate   && d > endDate)   return false;
    return true;
  });
}