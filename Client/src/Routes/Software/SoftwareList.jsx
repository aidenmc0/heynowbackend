/**
 * softwareList.jsx  —  thin config wrapper
 * Location: src/Routes/Software/SoftwareList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import DataListPage from "../../Components/DataTable/DetailListPage";

// ─────────────────────────────────────────────────────────────
// 1. Search columns  (multi-column mode)
// ─────────────────────────────────────────────────────────────
const SEARCH_COLUMNS = [
  {
    key: "all",
    label: "All",
    fields: [
      "EmpCode",
      "EmpType",
      "EmpName",
      "EmpSurname",
      "EmpEmail",
      "EmpPosition",
      "DepCode",
    ],
  },
  { key: "EmpCode", label: "Emp Code", fields: ["EmpCode"] },
  { key: "EmpType", label: "Emp Type", fields: ["EmpType"] },
  { key: "EmpName", label: "Name", fields: ["EmpName", "EmpSurname"] },
  { key: "EmpPosition", label: "Position", fields: ["EmpPosition"] },
  { key: "DepCode", label: "Dept", fields: ["DepCode", "DepShort", "DepFull"] },
  { key: "EmpEmail", label: "Email", fields: ["EmpEmail"] },
];

// ─────────────────────────────────────────────────────────────
// 2. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Software Code",
    cell: (soft) => (
      <span className="text-slate-600 text-xs">{soft.SoftCode}</span>
    ),
  },
  {
    header: "Software Name",
    cell: (soft) => (
      <span className="text-slate-600 text-xs">{soft.SoftName}</span>
    ),
  },
  {
    header: "Software Key",
    cell: (soft) => (
      <span className="text-slate-600 text-xs">{soft.SoftKey}</span>
    ),
  },  {
    header: "Expire Date",
    cell: (soft) => (
      <span className="text-slate-600 text-xs">{soft.ExpireDate}</span>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function SoftwareExpandedContent(soft) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Personal Info
        </p>
        <p className="text-sm text-slate-800">
          {soft.SoftCode}
        </p>
        <p className="text-sm text-slate-800">
          {soft.SoftName}
        </p>
      </div>
      
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath: "/Software/SoftwareList",
  entityKey: "SoftCode",
  columns: COLUMNS,
  searchColumns: SEARCH_COLUMNS,
  expandedContent: SoftwareExpandedContent,
  addButtonLabel: "+ Add Software",
  loadingText: "Loading software data...",
  emptyText: "No softwares found",
  onAdd: () => console.log("Add software"), // replace with navigate/modal
  onEdit: (soft) => console.log("Edit", soft.softCode), // replace with navigate/modal
  onDelete: (soft) => console.log("Delete", soft.softCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function SoftwareList() {
  return <DataListPage config={MENU_CONFIG} />;
}
