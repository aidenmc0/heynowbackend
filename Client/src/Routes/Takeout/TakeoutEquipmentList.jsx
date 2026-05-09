/**
 * TakeoutList.jsx  —  thin config wrapper
 * Location: src/Routes/Takeout/TakeoutList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import DataListPage from "../../Components/DataTable/DetailListPage";

// ─────────────────────────────────────────────────────────────
// 1. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Takeout Code",
    cell: (tkoEqp) => <span className="text-slate-800 text-xs">{tkoEqp.TkoEqpCode}</span>,
  },
  {
    header: "Equipment Detail",
    cell: (tkoEqp) => <span className="text-slate-800 text-xs">{tkoEqp.EqpCode}</span>,
  },
  {
    header: "Takeout Check",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (tkoEqp) => <span className="text-slate-800 text-xs">{tkoEqp.TakeoutCheck}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["TkoEqpCode", "EqpCode", "TakeoutCheck"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function TakeoutExpandedContent(tkoEqp) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Takeout Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {tkoEqp.TkoEqpCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Equipment Detail
        </p>
        <p className="text-sm text-slate-800">{tkoEqp.EqpCode}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Takeout Check
        </p>
        <p className="text-sm text-slate-800">{tkoEqp.TakeoutCheck}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Takeout/TakeoutList",
  entityKey:       "TkoEqpCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: TakeoutExpandedContent,
  addButtonLabel:  "+ Add Takeout",
  loadingText:     "Loading Takeout data...",
  emptyText:       "No Takeout found",
  onAdd:    () => console.log("Add Takeout"),
  onEdit:   (tkc) => console.log("Edit", tkc.TkoEqpCode),
  onDelete: (tkc) => console.log("Delete", tkc.TkoEqpCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function TakeoutList() {
  return <DataListPage config={MENU_CONFIG} />;
}