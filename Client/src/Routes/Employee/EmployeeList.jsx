/**
 * EmployeeList.jsx — thin config wrapper
 * Location: src/Routes/Controls/Employee/EmployeeList.jsx
 */

import { useState, useCallback } from "react";
import {
  CheckCircle, XCircle, ChevronDown, Filter,
  ShieldCheck, User, Building2, Phone, BadgeCheck,
  Hash, UserCircle2, CalendarDays, Clock, Pencil,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import DateRangeFilter from "../../Components/DataTable/DateRangeFilter";
import { applyDateRange } from "../../Components/DataTable/DateRangeUtils";
import CreateEmployee from "./CreateEmployee";
import EditEmployee from "./EditEmployee";

// ─── Shared Badge Components ──────────────────────────────────────────────────

function TypeBadge({ type }) {
  const styles = {
    ADMIN: { icon: <ShieldCheck size={12} className="text-purple-500" />, cls: "text-purple-700 bg-purple-50 border-purple-200" },
    STAFF: { icon: <User size={12} className="text-blue-500" />, cls: "text-blue-700 bg-blue-50 border-blue-200" },
  };
  const s = styles[type] ?? styles.STAFF;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${s.cls}`}>
      {s.icon}{type}
    </span>
  );
}

function ActiveBadge({ deleteflag }) {
  const isActive = deleteflag === "N";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
      isActive ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"
    }`}>
      {isActive ? <BadgeCheck size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-red-500" />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Expanded Content Helpers ─────────────────────────────────────────────────

function InfoRow({ icon, label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="mt-0.5 flex-shrink-0 text-slate-400">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className={`text-sm text-slate-800 break-words leading-snug ${
          mono ? "font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs inline-block" : "font-medium"
        }`}>{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

function EmployeeAvatar({ emp }) {
  const src = emp.emp_img || `https://ui-avatars.com/api/?name=${emp.emp_name}&background=e2e8f0&color=475569&size=128`;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <img
        src={src} alt={emp.emp_name}
        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${emp.emp_name}&background=e2e8f0&color=475569&size=128`; }}
      />
      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
        emp.deleteflag === "N" ? "bg-emerald-500" : "bg-slate-300"
      }`} />
    </div>
  );
}

// ─── Employee Expanded Content (ใช้ใน MENU_CONFIG) ───────────────────────────

function EmployeeExpandedContent(emp) {
  const fullName = [emp.emp_prefix, emp.emp_name, emp.emp_surname].filter(Boolean).join(" ");
  const createdDate = emp.createdat
    ? new Date(emp.createdat).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const updatedDate = emp.updatedat
    ? new Date(emp.updatedat).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      {/* Hero Card */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-sm">
        <EmployeeAvatar emp={emp} />
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold text-slate-900 leading-tight truncate">{fullName}</h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">{emp.emp_position || "—"}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <TypeBadge type={emp.emp_type} />
            <ActiveBadge deleteflag={emp.deleteflag} />
          </div>
        </div>
      </div>

      <SectionCard title="Identity">
        <InfoRow icon={<Hash size={14} />} label="Employee Code" value={emp.emp_code} mono />
        <InfoRow icon={<UserCircle2 size={14} />} label="Full Name" value={fullName} />
        <InfoRow icon={<Phone size={14} />} label="Telephone" value={emp.emp_tel || "—"} />
      </SectionCard>

      <SectionCard title="Department">
        <InfoRow icon={<Building2 size={14} />} label="Department Name" value={emp.dep_full || "—"} />
        <InfoRow icon={<Hash size={14} />} label="Department Code" value={emp.dep_code} mono />
        {emp.dep_short && <InfoRow icon={<Hash size={14} />} label="Short Name" value={emp.dep_short} mono />}
      </SectionCard>

      <SectionCard title="Record Info">
        <InfoRow icon={<CalendarDays size={14} />} label="Created"
          value={createdDate ? `${createdDate}${emp.createdby ? ` · by ${emp.createdby}` : ""}` : "—"} />
        {updatedDate && <InfoRow icon={<Clock size={14} />} label="Last Updated" value={updatedDate} />}
      </SectionCard>
    </>
  );
}

// ─── Table Columns ────────────────────────────────────────────────────────────

const SEARCH_FIELDS = ["emp_code", "emp_name", "emp_surname", "emp_position", "dep_code", "dep_full", "dep_short"];

const COLUMNS = [
  {
    header: "Employee",
    cell: (emp) => (
      <div className="flex items-center gap-3">
        <img
          src={emp.emp_img || `https://ui-avatars.com/api/?name=${emp.emp_name}&background=e2e8f0&color=475569`}
          alt={emp.emp_name}
          className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${emp.emp_name}&background=e2e8f0&color=475569`; }}
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
    header: "Department",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <div className="flex items-center gap-2">
        <Building2 size={13} className="text-slate-400 flex-shrink-0" />
        <div>
          <div className="font-medium text-slate-800 text-xs">{emp.dep_full || "—"}</div>
          <div className="text-[11px] text-slate-500">{emp.dep_short || ""}</div>
        </div>
      </div>
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
    cell: (emp) => <div className="text-xs text-slate-600">{emp.emp_tel || "—"}</div>,
  },
  {
    header: "Created",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (emp) => (
      <div className="text-[11px] text-slate-500">
        {emp.createdat ? new Date(emp.createdat).toLocaleDateString("th-TH") : "—"}
      </div>
    ),
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeList() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setRefreshKey((prev) => prev + 1);
  };

  const filterFn = useCallback(
    (rows) => {
      let result = rows;
      if (typeFilter !== "all") result = result.filter((r) => r.emp_type === typeFilter);
      if (statusFilter !== "all") result = result.filter((r) => r.deleteflag === statusFilter);
      result = applyDateRange(result, "createdat", startDate, endDate);
      return result;
    },
    [typeFilter, statusFilter, startDate, endDate],
  );

  const extraFilters = useCallback(
    () => (
      <>
        <div className="relative flex-shrink-0 w-36">
          <Filter className="absolute left-2.5 top-1.5 text-slate-400" size={15} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600">
            <option value="all">All Types</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={15} />
        </div>

        <div className="relative flex-shrink-0 w-36">
          <Filter className="absolute left-2.5 top-1.5 text-slate-400" size={15} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600">
            <option value="all">All Status</option>
            <option value="N">Active</option>
            <option value="Y">Inactive</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={15} />
        </div>

        <DateRangeFilter startDate={startDate} endDate={endDate}
          onStartChange={setStartDate} onEndChange={setEndDate}
          onClear={() => { setStartDate(""); setEndDate(""); }} />
      </>
    ),
    [typeFilter, statusFilter, startDate, endDate],
  );

  const MENU_CONFIG = {
    apiPath: "/employee",
    entityKey: "emp_code",
    columns: COLUMNS,
    searchFields: SEARCH_FIELDS,
    expandedContent: EmployeeExpandedContent,          // ← layout ของ Employee
    title: (emp) => [emp.emp_prefix, emp.emp_name, emp.emp_surname].filter(Boolean).join(" "),
    subtitle: (emp) => emp.emp_position,               // ← subtitle ใน header drawer
    addButtonLabel: "+ Add Employee",
    loadingText: "Loading employee data...",
    emptyText: "No employees found",
    onAdd: () => setIsModalOpen(true),
    onEdit: (emp) => setEditingEmployee(emp),
    onDelete: (emp) => console.log("Delete", emp.emp_code),
  };

  return (
    <>
      <DataListPage key={refreshKey} config={{ ...MENU_CONFIG, filterFn, extraFilters }} />

      {isModalOpen && (
        <CreateEmployee onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
      )}
      {editingEmployee && (
        <EditEmployee employee={editingEmployee} onClose={() => setEditingEmployee(null)} onSuccess={handleSuccess} />
      )}
    </>
  );
}