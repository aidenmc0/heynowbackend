/**
 * EquipmentList.jsx  —  thin config wrapper
 * Location: src/Routes/Equipment/EquipmentList.jsx
 *
 * All shared logic (fetch, search, pagination, expand) lives in DataListPage.
 * Only change things HERE: columns, API path, search fields, expand content.
 */

import { useState, useCallback } from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Filter,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import DateRangeFilter from "../../Components/DataTable/DateRangeFilter";
import { applyDateRange } from "../../Components/DataTable/DateRangeUtils";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Status badge — reused in column cell and expanded panel */
function StatusBadge({ status }) {
  const styles = {
    Normal: {
      icon: <CheckCircle size={12} className="text-green-600" />,
      text: "text-green-700 bg-green-50 border-green-200",
    },
    Disable: {
      icon: <AlertCircle size={12} className="text-red-600" />,
      text: "text-red-700 bg-red-50 border-red-200",
    },
    Maintenance: {
      icon: <AlertTriangle size={12} className="text-amber-600" />,
      text: "text-amber-700 bg-amber-50 border-amber-200",
    },
  };
  const s = styles[status] ?? styles.Normal;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${s.text}`}
    >
      {s.icon}
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Simple search fields
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["EqpCode", "TypEqpName", "EqpBrand", "EmpName"];

// ─────────────────────────────────────────────────────────────
// 2. Table columns
// ─────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    header: "Code",
    cell: (eqp) => (
      <>
        <div className="font-semibold text-slate-800 text-xs">
          {eqp.EqpCode}
        </div>
        <div className="text-[11px] text-slate-500 ">AC : {eqp.EqpAsset}</div>
      </>
    ),
  },
  {
    header: "Type / Brand",
    cell: (eqp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">
          {eqp.EqpBrand} - {eqp.EqpSerie}
        </div>
        <div className="text-[11px] text-slate-500">
          SN : {eqp.EqpSerial}
        </div>
      </>
    ),
  },
  {
    header: "Status",
    cell: (eqp) => <StatusBadge status={eqp.EqpStatus} />,
  },
  {
    header: "Owner",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (eqp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">
          {eqp.EmpPrefix} {eqp.EmpName} {eqp.EmpSurname}
        </div>
        <div className="text-[11px] text-slate-500">{eqp.EmpCode.split("-")[0]} : {eqp.EmpPosition}</div>
      </>
    ),
  },
  {
    header: "Department",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (eqp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">{eqp.DepCode.split("-")[0]}</div>
        <div className="text-[11px] text-slate-500">{eqp.DepFull}</div>
      </>
    ),
  },
  {
    header: "Vendor",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (eqp) => (
      <>
        <div className="font-medium text-slate-800 text-xs">
          {eqp.VdrCompany}
        </div>
        <div className="text-[11px] text-slate-400">
          {eqp.VdrName}
        </div>
      </>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function EquipmentExpandedContent(eqp) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Purchase Info
        </p>
        <p className="text-sm text-slate-800">PR: {eqp.PurPr}</p>
        <p className="text-sm text-slate-800">PO: {eqp.PurPo}</p>
        <p className="text-sm text-slate-800">Status: {eqp.PurStatus}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Vendor Details
        </p>
        <p className="text-sm text-slate-800">{eqp.VdrName}</p>
        <p className="text-sm text-slate-800">Company: {eqp.VdrCompany}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Created
        </p>
        <p className="text-sm text-slate-800">
          {new Date(eqp.createdAt).toLocaleDateString()} at{" "}
          {new Date(eqp.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Equipment ID
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {eqp.EqpCode}
        </p>
      </div>
    </div>
  );
}

// ── Config ─────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath: "/Equipment/EquipmentList",
  entityKey: "EqpCode",
  columns: COLUMNS,
  searchFields: SEARCH_FIELDS,
  expandedContent: EquipmentExpandedContent,
  addButtonLabel: "+ Add Equipment",
  loadingText: "Loading equipment data...",
  emptyText: "No equipment found",
  onAdd: () => console.log("Add equipment"),
  onEdit: (eqp) => console.log("Edit", eqp.EqpCode),
  onDelete: (eqp) => console.log("Delete", eqp.EqpCode),
};

// ─────────────────────────────────────────────────────────────
// 4. Main component — holds statusFilter + date range state
// ─────────────────────────────────────────────────────────────
export default function EquipmentList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Combined filterFn ──────────────────────────────────────
  const filterFn = useCallback(
    (rows) => {
      let result = rows;
      if (statusFilter !== "all") {
        result = result.filter((r) => r.EqpStatus === statusFilter);
      }
      result = applyDateRange(result, "PurReceiveDate", startDate, endDate);
      return result;
    },
    [statusFilter, startDate, endDate],
  );

  // ── extraFilters — renders into Toolbar slot ───────────────
  const extraFilters = useCallback(
    () => (
      <>
        {/* Status dropdown */}
        <div className="relative flex-shrink-0 w-44">
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
            <option value="Normal">Normal</option>
            <option value="Disable">Disabled</option>
            <option value="Maintenance">Maintenance</option>
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
    [statusFilter, startDate, endDate],
  );

  const finalConfig = {
    ...MENU_CONFIG,
    filterFn,
    extraFilters,
  };
  
  return <DataListPage config={finalConfig} />;
}
