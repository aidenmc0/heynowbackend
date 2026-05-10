/**
 * EmployeeList.jsx  —  thin config wrapper
 * Location: src/Routes/Employee/EmployeeList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import { useState, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  Filter,
  ShieldCheck,
  User,
} from "lucide-react";
import DataListPage from "../../../Components/DataTable/DetailListPage";
import DateRangeFilter from "../../../Components/DataTable/DateRangeFilter";
import { applyDateRange } from "../../../Components/DataTable/DateRangeUtils";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Employee type badge */
function TypeBadge({ type }) {
  const styles = {
    ADMIN: {
      icon: <ShieldCheck size={12} className="text-purple-600" />,
      text: "text-purple-700 bg-purple-50 border-purple-200",
    },
    STAFF: {
      icon: <User size={12} className="text-blue-600" />,
      text: "text-blue-700 bg-blue-50 border-blue-200",
    },
  };
  const s = styles[type] ?? styles.STAFF;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${s.text}`}
    >
      {s.icon}
      {type}
    </span>
  );
}

/** Active/Delete flag badge */
function ActiveBadge({ deleteflag }) {
  const isActive = deleteflag === "N";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
        isActive
          ? "text-green-700 bg-green-50 border-green-200"
          : "text-red-700 bg-red-50 border-red-200"
      }`}
    >
      {isActive ? (
        <CheckCircle size={12} className="text-green-600" />
      ) : (
        <XCircle size={12} className="text-red-600" />
      )}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Simple search fields
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["emp_code", "emp_name", "emp_surname", "emp_position", "dep_code"];

// ─────────────────────────────────────────────────────────────
// 2. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Employee",
    cell: (emp) => (
      <div className="flex items-center gap-3">
        <img
          src={emp.emp_img || "https://ui-avatars.com/api/?name=" + emp.emp_name}
          alt={emp.emp_name}
          className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=" + emp.emp_name + "&background=e2e8f0&color=475569";
          }}
        />
        <div>
          <div className="font-semibold text-slate-800 text-xs">
            {emp.emp_prefix} {emp.emp_name} {emp.emp_surname}
          </div>
          <div className="text-[11px] text-slate-500">{emp.emp_code}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Position",
    cell: (emp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">{emp.emp_position}</div>
        <div className="text-[11px] text-slate-500">{emp.dep_code}</div>
      </>
    ),
  },
  {
    header: "Type",
    cell: (emp) => <TypeBadge type={emp.emp_type} />,
  },
  {
    header: "Status",
    cell: (emp) => <ActiveBadge deleteflag={emp.deleteflag} />,
  },
  {
    header: "Contact",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <div className="text-xs text-slate-600">{emp.emp_tel || "—"}</div>
    ),
  },
  {
    header: "Created",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <div className="text-[11px] text-slate-500">
        {emp.createdat
          ? new Date(emp.createdat).toLocaleDateString("th-TH")
          : "—"}
      </div>
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
          {emp.emp_prefix} {emp.emp_name} {emp.emp_surname}
        </p>
        <p className="text-sm text-slate-500">{emp.emp_position}</p>
        <p className="text-sm text-slate-500">Tel: {emp.emp_tel || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Department
        </p>
        <p className="text-sm text-slate-800">{emp.dep_code}</p>
        <p className="text-sm text-slate-500">Type: {emp.emp_type}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Record Info
        </p>
        <p className="text-sm text-slate-800">
          Created:{" "}
          {emp.createdat
            ? new Date(emp.createdat).toLocaleDateString("th-TH")
            : "—"}
        </p>
        <p className="text-sm text-slate-500">By: {emp.createdby}</p>
        {emp.updatedat && (
          <p className="text-sm text-slate-500">
            Updated: {new Date(emp.updatedat).toLocaleDateString("th-TH")}
          </p>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee ID
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {emp.emp_code}
        </p>
      </div>
    </div>
  );
}

// ── Config ─────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath: "/employee",
  entityKey: "emp_code",
  columns: COLUMNS,
  searchFields: SEARCH_FIELDS,
  expandedContent: EmployeeExpandedContent,
  addButtonLabel: "+ Add Employee",
  loadingText: "Loading employee data...",
  emptyText: "No employees found",
  onAdd: () => console.log("Add employee"),
  onEdit: (emp) => console.log("Edit", emp.emp_code),
  onDelete: (emp) => console.log("Delete", emp.emp_code),
};

// ─────────────────────────────────────────────────────────────
// 4. Main component — holds typeFilter + date range state
// ─────────────────────────────────────────────────────────────
export default function EmployeeList() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Combined filterFn ──────────────────────────────────────
  const filterFn = useCallback(
    (rows) => {
      let result = rows;
      if (typeFilter !== "all") {
        result = result.filter((r) => r.emp_type === typeFilter);
      }
      if (statusFilter !== "all") {
        result = result.filter((r) => r.deleteflag === statusFilter);
      }
      result = applyDateRange(result, "createdat", startDate, endDate);
      return result;
    },
    [typeFilter, statusFilter, startDate, endDate],
  );

  // ── extraFilters — renders into Toolbar slot ───────────────
  const extraFilters = useCallback(
    () => (
      <>
        {/* Type dropdown */}
        <div className="relative flex-shrink-0 w-36">
          <Filter
            className="absolute left-2.5 top-1.5 text-slate-400"
            size={15}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600"
          >
            <option value="all">All Types</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
          </select>
          <ChevronDown
            className="absolute right-2.5 top-2 text-slate-400 pointer-events-none"
            size={15}
          />
        </div>

        {/* Status dropdown */}
        <div className="relative flex-shrink-0 w-36">
          <Filter
            className="absolute left-2.5 top-1.5 text-slate-400"
            size={15}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600"
          >
            <option value="all">All Status</option>
            <option value="N">Active</option>
            <option value="Y">Inactive</option>
          </select>
          <ChevronDown
            className="absolute right-2.5 top-2 text-slate-400 pointer-events-none"
            size={15}
          />
        </div>

        {/* Date range */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onClear={() => {
            setStartDate("");
            setEndDate("");
          }}
        />
      </>
    ),
    [typeFilter, statusFilter, startDate, endDate],
  );

  const finalConfig = {
    ...MENU_CONFIG,
    filterFn,
    extraFilters,
  };

  return <DataListPage config={finalConfig} />;
}