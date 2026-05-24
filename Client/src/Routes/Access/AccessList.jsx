/**
 * AccessList.jsx  —  thin config wrapper
 * Location: src/Routes/Access/AccessList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import DataListPage from "../../../Components/DataTable/DetailListPage";

// ─────────────────────────────────────────────────────────────
// 1. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Access Code",
    cell: (acc) => <span className="text-slate-800 text-xs">{acc.AccCode}</span>,
  },
  {
    header: "Employee Detail",
    cell: (acc) => <span className="text-slate-800 text-xs">{acc.EmpCode}</span>,
  },
  {
    header: "Access Dashboard",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (acc) => <span className="text-slate-800 text-xs">{acc.AccDashboard}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["AccCode", "EmpCode", "AccDashboard"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function AccessExpandedContent(acc) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Access Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {acc.AccCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee Code
        </p>
        <p className="text-sm text-slate-800">{acc.EmpCode}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Access Dashboard
        </p>
        <p className="text-sm text-slate-800">{acc.AccDashboard}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Access/AccessList",
  entityKey:       "AccCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: AccessExpandedContent,
  addButtonLabel:  "+ Add Access",
  loadingText:     "Loading Access data...",
  emptyText:       "No Access found",
  onAdd:    () => console.log("Add Access"),
  onEdit:   (acc) => console.log("Edit", acc.AccCode),
  onDelete: (acc) => console.log("Delete", acc.AccCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function AccessList() {
  return <DataListPage config={MENU_CONFIG} />;
}