/**
 * VendorList.jsx  —  thin config wrapper
 * Location: src/Routes/Vendor/VendorList.jsx
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
    header: "Vendor Code",
    cell: (vdr) => <span className="text-slate-800 text-xs">{vdr.VdrCode}</span>,
  },
  {
    header: "Company Detail",
    cell: (vdr) => <span className="text-slate-800 text-xs">{vdr.CompanyName}</span>,
  },
  {
    header: "Vendor Name",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (vdr) => <span className="text-slate-800 text-xs">{vdr.VdrName}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["VdrCode", "CompanyName", "VdrName"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function VendorExpandedContent(vdr) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Vendor Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {vdr.VdrCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Company Detail
        </p>
        <p className="text-sm text-slate-800">{vdr.CompanyName}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Vendor Name
        </p>
        <p className="text-sm text-slate-800">{vdr.VdrName}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Vendor/VendorList",
  entityKey:       "VdrCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: VendorExpandedContent,
  addButtonLabel:  "+ Add Vendor",
  loadingText:     "Loading Vendor data...",
  emptyText:       "No Vendor found",
  onAdd:    () => console.log("Add Vendor"),
  onEdit:   (vdr) => console.log("Edit", vdr.VdrCode),
  onDelete: (vdr) => console.log("Delete", vdr.VdrCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function VendorList() {
  return <DataListPage config={MENU_CONFIG} />;
}