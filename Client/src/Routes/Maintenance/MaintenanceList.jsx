/**
 * MaintenanceList.jsx  —  thin config wrapper
 * Location: src/Routes/Maintenance/MaintenanceList.jsx
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
    header: "Maintenance Code",
    cell: (main) => <span className="text-slate-800 text-xs">{main.MainReqCode}</span>,
  },
  {
    header: "Employee Detail",
    cell: (main) => <span className="text-slate-800 text-xs">{main.EmpCode}</span>,
  },
  {
    header: "Type Maintenance",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (main) => <span className="text-slate-800 text-xs">{main.TypMainCode}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["MainReqCode", "EmpCode", "TypMainCode"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function MaintenanceExpandedContent(main) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Maintenance Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {main.MainReqCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee Code
        </p>
        <p className="text-sm text-slate-800">{main.EmpCode}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Type Maintenance
        </p>
        <p className="text-sm text-slate-800">{main.TypMainCode}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Maintenance/MaintenanceList",
  entityKey:       "MainReqCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: MaintenanceExpandedContent,
  addButtonLabel:  "+ Add Maintenance",
  loadingText:     "Loading Maintenance data...",
  emptyText:       "No Maintenance found",
  onAdd:    () => console.log("Add Maintenance"),
  onEdit:   (main) => console.log("Edit", main.MainReqCode),
  onDelete: (main) => console.log("Delete", main.MainReqCode),
};
// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function MaintenanceList() {
  return <DataListPage config={MENU_CONFIG} />;
}