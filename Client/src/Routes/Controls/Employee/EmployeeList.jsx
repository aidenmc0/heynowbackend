/**
 * EmployeeList.jsx  —  thin config wrapper
 * Location: src/Routes/Employee/EmployeeList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import DataListPage from "../../../Components/DataTable/DetailListPage";
import { API_URL } from "../../../variable";

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
    header: "Image",
    cell: (emp) => (
      <img
        src={`${API_URL}/uploads/employees/${emp.EmpImg}`}
        alt="emp"
        className="w-8 h-8 rounded-full object-cover border"
      />
    ),
  },
  {
    header: "Emp Code",
    cell: (emp) => (
      <span className="text-slate-600 text-xs">{emp.EmpCode}</span>
    ),
  },
  {
    header: "Emp Type",
    cell: (emp) => (
      <span className="text-slate-600 text-xs">{emp.EmpType}</span>
    ),
  },
  {
    header: "Emp Name",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">
          {emp.EmpPrefix}{emp.EmpName} {emp.EmpSurname}
        </div>
        <div className="text-[11px] text-slate-400">
          Position: {emp.EmpPosition}
        </div>
      </>
    ),
  },
  {
    header: "Department",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">
          {emp.DepCode?.slice(0, 4)} – {emp.DepShort}
        </div>
        <div className="text-[11px] text-slate-400">{emp.DepFull}</div>
      </>
    ),
  },
  {
    header: "E-mail",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <span className="text-xs text-slate-600">{emp.EmpEmail}</span>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function EmployeeExpandedContent(emp) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Personal Info
        </p>
        <p className="text-sm text-slate-800">
          {emp.EmpPrefix}{emp.EmpName} {emp.EmpSurname}
        </p>
        <p className="text-sm text-slate-800">Position: {emp.EmpPosition}</p>
        <p className="text-sm text-slate-800">Type: {emp.EmpType}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Department
        </p>
        <p className="text-sm text-slate-800">{emp.DepFull}</p>
        <p className="text-sm text-slate-800">Short: {emp.DepShort}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Contact
        </p>
        <p className="text-sm text-slate-800">{emp.EmpEmail}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee ID
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {emp.EmpCode}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath: "/Employee/EmployeeList",
  entityKey: "EmpCode",
  columns: COLUMNS,
  searchColumns: SEARCH_COLUMNS,
  expandedContent: EmployeeExpandedContent,
  addButtonLabel: "+ Add Employee",
  loadingText: "Loading employee data...",
  emptyText: "No employees found",
  onAdd: () => console.log("Add employee"), // replace with navigate/modal
  onEdit: (emp) => console.log("Edit", emp.EmpCode), // replace with navigate/modal
  onDelete: (emp) => console.log("Delete", emp.EmpCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function EmployeeList() {
  return <DataListPage config={MENU_CONFIG} />;
}
