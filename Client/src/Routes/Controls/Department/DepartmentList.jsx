import DataListPage from "../../../Components/DataTable/DetailListPage";

// ─────────────────────────────────────────────────────────────
// 1. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Code",
    cell: (dept) => (
      <>
        <div className="font-semibold text-slate-800 text-xs">{dept.dep_code}</div>
        <div className="text-[11px] text-slate-500">{dept.dep_short}</div>
      </>
    ),
  },
  {
    header: "Full Name",
    cell: (dept) => <span className="text-slate-800 text-xs">{dept.dep_full}</span>,
  },
  {
    header: "Status",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (dept) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
        dept.deleteflag === "N"
          ? "text-green-700 bg-green-50 border-green-200"
          : "text-red-700 bg-red-50 border-red-200"
      }`}>
        {dept.deleteflag === "N" ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Created",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (dept) => (
      <div className="text-[11px] text-slate-500">
        {dept.createdat ? new Date(dept.createdat).toLocaleDateString("th-TH") : "—"}
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Search fields
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["dep_code", "dep_full", "dep_short"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel
// ─────────────────────────────────────────────────────────────
function DepartmentExpandedContent(dept) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Department Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {dept.dep_code}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Full Name
        </p>
        <p className="text-sm text-slate-800">{dept.dep_full}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Short Name
        </p>
        <p className="text-sm text-slate-800">{dept.dep_short}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Record Info
        </p>
        <p className="text-sm text-slate-800">
          Created: {dept.createdat ? new Date(dept.createdat).toLocaleDateString("th-TH") : "—"}
        </p>
        <p className="text-sm text-slate-500">By: {dept.createdby}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/department",       // ✅ ตรงกับ backend route
  entityKey:       "dep_code",          // ✅ lowercase
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,
  expandedContent: DepartmentExpandedContent,
  addButtonLabel:  "+ Add Department",
  loadingText:     "Loading department data...",
  emptyText:       "No departments found",
  onAdd:    () => console.log("Add department"),
  onEdit:   (dept) => console.log("Edit", dept.dep_code),
  onDelete: (dept) => console.log("Delete", dept.dep_code),
};

export default function DepartmentList() {
  return <DataListPage config={MENU_CONFIG} />;
}