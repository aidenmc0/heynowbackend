/**
 * PurchaseList.jsx  —  thin config wrapper
 * Location: src/Routes/Purchase/PurchaseList.jsx
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
    header: "Purchase Code",
    cell: (pur) => <span className="text-slate-800 text-xs">{pur.PurCode}</span>,
  },
  {
    header: "Employee Detail",
    cell: (pur) => <span className="text-slate-800 text-xs">{pur.EmpCode}</span>,
  },
  {
    header: "Vendor Detail",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (pur) => <span className="text-slate-800 text-xs">{pur.VdrCode}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["PurCode", "EmpCode", "VdrCode"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function PurchaseExpandedContent(pur) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Purchase Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {pur.PurCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee Detail
        </p>
        <p className="text-sm text-slate-800">{pur.EmpCode}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Vendor Detail
        </p>
        <p className="text-sm text-slate-800">{pur.VdrCode}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Purchase/PurchaseList",
  entityKey:       "PurCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: PurchaseExpandedContent,
  addButtonLabel:  "+ Add Purchase",
  loadingText:     "Loading Purchase data...",
  emptyText:       "No Purchase found",
  onAdd:    () => console.log("Add Purchase"),
  onEdit:   (pur) => console.log("Edit", pur.PurCode),
  onDelete: (pur) => console.log("Delete", pur.PurCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function PurchaseList() {
  return <DataListPage config={MENU_CONFIG} />;
}