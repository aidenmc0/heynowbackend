/**
 * Pagination.jsx  —  Section 4
 * Location: src/Components/DataTable/Pagination.jsx
 *
 * Rows-per-page selector, page info text, prev/next buttons, numbered page buttons.
 * Fully stateless — receives everything as props, calls setters upward.
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * @param {{
 *   currentPage:    number,
 *   totalPages:     number,
 *   filteredCount:  number,
 *   pageSize:       number,
 *   setCurrentPage: (page: number) => void,
 *   setPageSize:    (size: number) => void,
 * }} props
 */
export default function Pagination({
  currentPage,
  totalPages,
  filteredCount,
  pageSize,
  setCurrentPage,
  setPageSize,
}) {
  // Build the window of up-to-5 visible page numbers
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) =>
    totalPages <= 5
      ? i + 1
      : Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i
  );

  return (
    <div className="bg-white border-t border-slate-250 px-6 py-1 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">

      {/* ── Rows per page ────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 font-medium">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1); // reset to first page on size change
          }}
          className="text-center bg-slate-50 border border-slate-200 rounded-sm text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
          <option value={99999}>All</option>
        </select>
      </div>

      {/* ── Info text ────────────────────────────────────── */}
      <div className="text-sm text-slate-500 font-medium">
        Page{" "}
        <span className="font-bold text-slate-800">{currentPage}</span>
        {" "}of{" "}
        <span className="font-bold text-slate-800">{totalPages}</span>
        {" "}•{" "}Total{" "}
        <span className="font-bold text-slate-800">{filteredCount}</span>
        {" "}records
      </div>

      {/* ── Page buttons ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="w-6 h-6 inline-flex items-center justify-center hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 rounded-sm border border-slate-200 transition-all text-slate-600 hover:text-red-600 hover:border-red-200"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbered pages */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-6 h-6 inline-flex items-center justify-center rounded-sm border transition-all font-medium text-sm ${
                currentPage === pageNum
                  ? "bg-red-600 text-white border-red-600 shadow-sm shadow-red-100"
                  : "bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="w-6 h-6 inline-flex items-center justify-center hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 rounded-sm border border-slate-200 transition-all text-slate-600 hover:text-red-600 hover:border-red-200"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}