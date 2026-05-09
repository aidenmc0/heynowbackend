/**
 * TokenList.jsx  —  thin config wrapper
 * Location: src/Routes/Token/TokenList.jsx
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
    header: "Token Code",
    cell: (tkc) => <span className="text-slate-800 text-xs">{tkc.TokenCode}</span>,
  },
  {
    header: "Employee Detail",
    cell: (tkc) => <span className="text-slate-800 text-xs">{tkc.EmpCode}</span>,
  },
  {
    header: "Token",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (tkc) => <span className="text-slate-800 text-xs">{tkc.Token}</span>,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. Simple search fields  (no column switcher needed)
// ─────────────────────────────────────────────────────────────
const SEARCH_FIELDS = ["TokenCode", "EmpCode", "Token"];

// ─────────────────────────────────────────────────────────────
// 3. Expanded panel content
// ─────────────────────────────────────────────────────────────
function TokenExpandedContent(tkc) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Token Code
        </p>
        <p className="text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block">
          {tkc.TokenCode}
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Employee Detail
        </p>
        <p className="text-sm text-slate-800">{tkc.EmpCode}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Token
        </p>
        <p className="text-sm text-slate-800">{tkc.Token}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Config object  ← only thing that changes per feature
// ─────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  apiPath:         "/Token/TokenList",
  entityKey:       "TokenCode",           // unique identifier for edit/delete
  columns:         COLUMNS,
  searchFields:    SEARCH_FIELDS,   // simple search (no column switcher)
  expandedContent: TokenExpandedContent,
  addButtonLabel:  "+ Add Token",
  loadingText:     "Loading Token data...",
  emptyText:       "No Token found",
  onAdd:    () => console.log("Add Token"),
  onEdit:   (tkc) => console.log("Edit", tkc.TokenCode),
  onDelete: (tkc) => console.log("Delete", tkc.TokenCode),
};

// ─────────────────────────────────────────────────────────────
// 5. Export  — one line
// ─────────────────────────────────────────────────────────────
export default function TokenList() {
  return <DataListPage config={MENU_CONFIG} />;
}