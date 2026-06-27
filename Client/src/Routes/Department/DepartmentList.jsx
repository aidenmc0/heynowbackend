import { useState } from "react";
import { Building2, Hash, CalendarDays, BadgeCheck, XCircle, Clock } from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateDepartment from "./CreateDepartment";
import EditDepartment from "./EditDepartment";

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

function StatusBadge({ deleteflag }) {
  const isActive = deleteflag === "N";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
      isActive ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"
    }`}>
      {isActive
        ? <BadgeCheck size={12} className="text-emerald-500" />
        : <XCircle size={12} className="text-red-500" />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Department Expanded Content ──────────────────────────────────────────────

function DepartmentExpandedContent(dept) {
  const createdDate = dept.createdat
    ? new Date(dept.createdat).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const updatedDate = dept.updatedat
    ? new Date(dept.updatedat).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      {/* Hero Card */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <Building2 size={28} className="text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold text-slate-900 leading-tight truncate">{dept.dep_full}</h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{dept.dep_code}</p>
          <div className="mt-2">
            <StatusBadge deleteflag={dept.deleteflag} />
          </div>
        </div>
      </div>

      {/* Department Info */}
      <SectionCard title="Department Info">
        <InfoRow icon={<Hash size={14} />}      label="Department Code" value={dept.dep_code} mono />
        <InfoRow icon={<Building2 size={14} />} label="Full Name"        value={dept.dep_full} />
        <InfoRow icon={<Hash size={14} />}      label="Short Name"       value={dept.dep_short} mono />
      </SectionCard>

      {/* Record Info */}
      <SectionCard title="Record Info">
        <InfoRow
          icon={<CalendarDays size={14} />}
          label="Created"
          value={createdDate ? `${createdDate}${dept.createdby ? ` · by ${dept.createdby}` : ""}` : "—"}
        />
        {updatedDate && (
          <InfoRow icon={<Clock size={14} />} label="Last Updated" value={updatedDate} />
        )}
      </SectionCard>
    </>
  );
}

// ─── Table Columns ────────────────────────────────────────────────────────────

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

const SEARCH_FIELDS = ["dep_code", "dep_full", "dep_short"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DepartmentList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    setRefreshKey((prev) => prev + 1);
  };

  const MENU_CONFIG = {
    apiPath:         "/department",
    entityKey:       "dep_code",
    columns:         COLUMNS,
    searchFields:    SEARCH_FIELDS,
    expandedContent: DepartmentExpandedContent,
    title:           (dept) => dept.dep_full,
    subtitle:        (dept) => dept.dep_code,
    addButtonLabel:  "+ Add Department",
    loadingText:     "Loading department data...",
    emptyText:       "No departments found",
    onAdd:    () => setIsModalOpen(true),
    onEdit:   (dept) => setEditingDept(dept),
    onDelete: (dept) => console.log("Delete", dept.dep_code),
  };

  return (
    <>
      <DataListPage key={refreshKey} config={MENU_CONFIG} />

      {isModalOpen && (
        <CreateDepartment
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      {editingDept && (
        <EditDepartment
          department={editingDept}
          onClose={() => setEditingDept(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}