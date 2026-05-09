/**
 * DateRangeFilter.jsx
 * Location: src/Components/DataTable/DateRangeFilter.jsx
 *
 * Reusable date range picker for toolbar filters.
 * Drop into any page's extraFilters() slot.
 *
 * Usage:
 *   import DateRangeFilter from "../../Components/DataTable/DateRangeFilter";
 *   import { applyDateRange } from "../../Components/DataTable/dateRangeUtils";
 *
 *   const [startDate, setStartDate] = useState("");
 *   const [endDate,   setEndDate]   = useState("");
 *
 *   <DateRangeFilter
 *     startDate={startDate}
 *     endDate={endDate}
 *     onStartChange={setStartDate}
 *     onEndChange={setEndDate}
 *     onClear={() => { setStartDate(""); setEndDate(""); }}
 *   />
 */

import { CalendarRange, X } from "lucide-react";

const INPUT_CLASS =
  "py-0.5 px-2 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-slate-50/50 text-xs text-slate-600 cursor-pointer w-36 transition-colors";

/**
 * @param {{
 *   startDate:     string,
 *   endDate:       string,
 *   onStartChange: (v: string) => void,
 *   onEndChange:   (v: string) => void,
 *   onClear:       () => void,
 *   label?:        string,   // optional left label, default "Receive Date"
 * }} props
 */
export default function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClear,
  label = "Receive Date",
}) {
  const hasFilter = startDate || endDate;

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">

      {/* Icon + optional label */}
      <CalendarRange className="text-slate-400 flex-shrink-0" size={15} />
      {label && (
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden xl:inline">
          {label}
        </span>
      )}

      {/* Start date */}
      <input
        type="date"
        value={startDate}
        max={endDate || undefined}
        onChange={(e) => onStartChange(e.target.value)}
        className={INPUT_CLASS}
        title="Start date"
      />

      <span className="text-slate-400 text-xs font-medium flex-shrink-0">–</span>

      {/* End date */}
      <input
        type="date"
        value={endDate}
        min={startDate || undefined}
        onChange={(e) => onEndChange(e.target.value)}
        className={INPUT_CLASS}
        title="End date"
      />

      {/* Clear button — visible only when a date is active */}
      {hasFilter && (
        <button
          onClick={onClear}
          className="p-0.5 rounded-sm hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
          title="Clear date filter"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}