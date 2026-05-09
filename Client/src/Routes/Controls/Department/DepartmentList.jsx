/**
 * DepartmentList.jsx  —  thin config wrapper
 * Location: src/Routes/Department/DepartmentList.jsx
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
    header: "Department Code",
    cell: (dept) => <span className="text-slate-800 text-xs">{dept.DepCode}</span>,
  },
  {
    header: "Full Name",
    cell: (dept) => <span className="text-slate-800 text-xs">{dept.DepFull}</span>,
  },
  {
    header: "Short Name",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (dept) => <span className="text-slate-800 text-xs">{dept.DepShort}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["DepCode", "DepFull", "DepShort"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function DepartmentExpandedContent(dept) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Department Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {dept.DepCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Full Name
        </p>
        <p className="text-sm text-slate-800">{dept.DepFull}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Short Name
        </p>
        <p className="text-sm text-slate-800">{dept.DepShort}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Department/DepartmentList",
  entityKey:       "DepCode",
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: DepartmentExpandedContent,
  addButtonLabel:  "+ Add Department",
  loadingText:     "Loading department data...",
  emptyText:       "No departments found",
  onAdd:    () => console.log("Add department"),
  onEdit:   (dept) => console.log("Edit", dept.DepCode),
  onDelete: (dept) => console.log("Delete", dept.DepCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function DepartmentList() {
  return <DataListPage config={MENU_CONFIG} />;
}