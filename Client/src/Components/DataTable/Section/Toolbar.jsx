/**
 * Toolbar.jsx  —  Section 1
 * Location: src/Components/DataTable/Toolbar.jsx
 *
 * Search input, column-filter dropdown, extra filters slot, record count badge, add button.
 */

import { Search, Filter, ChevronDown } from "lucide-react";

/**
 * @param {{
 *   searchTerm:     string,
 *   setSearchTerm:  Function,
 *   searchColumn:   string,
 *   setSearchColumn:Function,
 *   searchColumns:  import('./DataListPage').SearchColumnDef[] | undefined,
 *   filteredCount:  number,
 *   addButtonLabel: string,
 *   onAdd:          Function | undefined,
 *   extraFilters:   Function | undefined,
 *   setCurrentPage: Function,
 * }} props
 */
export default function Toolbar({
  searchTerm,
  setSearchTerm,
  searchColumn,
  setSearchColumn,
  searchColumns,
  filteredCount,
  addButtonLabel,
  onAdd,
  extraFilters,
  setCurrentPage,
}) {
  return (
    <div className="bg-white rounded-sm border border-slate-200 p-2.5 flex-shrink-0">
      <div className="flex items-center gap-2 flex-wrap">

        {/* Column selector — only rendered in multi-column search mode */}
        {searchColumns && (
          <div className="relative flex-shrink-0 w-36">
            <Filter className="absolute left-2.5 top-1.5 text-slate-400" size={15} />
            <select
              value={searchColumn}
              onChange={(e) => {
                setSearchColumn(e.target.value);
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-6 py-1 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-xs transition-colors text-slate-600"
            >
              {searchColumns.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-2 text-slate-400 pointer-events-none"
              size={14}
            />
          </div>
        )}

        {/* Search input */}
        <div className="relative w-56 flex-shrink-0">
          <Search className="absolute left-2.5 top-1.5 text-slate-400" size={13} />
          <input
            type="text"
            placeholder={
              searchColumns
                ? `Search ${searchColumns.find((c) => c.key === searchColumn)?.label ?? ""}...`
                : "Search..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-slate-50/50 text-sm transition-colors"
          />
        </div>

        {/* Extra filters slot — status dropdown, date pickers, etc. */}
        {extraFilters?.()}

        <div className="flex-1" />

        {/* Record count badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-sm px-3 py-1 text-xs font-medium text-slate-600 whitespace-nowrap flex-shrink-0">
          {filteredCount} record{filteredCount !== 1 ? "s" : ""}
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-sm font-medium transition-colors text-xs shadow-sm shadow-red-100 whitespace-nowrap flex-shrink-0"
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}