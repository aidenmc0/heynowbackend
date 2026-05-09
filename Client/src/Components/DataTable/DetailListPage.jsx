/**
 * DataListPage.jsx  —  Orchestrator
 * Location: src/Components/DataTable/DataListPage.jsx
 *
 * Owns state + data-fetching only.
 * Assembles the 4 section components — no UI markup lives here.
 *
 * Folder structure:
 *   src/Components/DataTable/
 *   |__ Section
 *       ├── Toolbar.jsx        ← Section 1
 *       ├── ExpandedPanel.jsx  ← Section 2
 *       ├── DataTable.jsx      ← Section 3
 *       └── Pagination.jsx     ← Section 4
 *   |__ DataListPage.jsx   ← you are here (state + fetch + compose)
 */

import { useEffect, useState, useMemo } from "react";
import { Package, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "./Section/Toolbar";       // Section 1
import ExpandedPanel from "./Section/ExpandedPanel"; // Section 2
import DataTable from "./Section/DataTable";     // Section 3
import Pagination from "./Section/Pagination";    // Section 4

import { Layout } from "../Layouts/Layout";
import { API_URL } from "../../variable";

// ─────────────────────────────────────────────────────────────
// Shared guard screens (tiny, kept here — not worth own files)
// ─────────────────────────────────────────────────────────────
function LoadingState({ text = "Loading data..." }) {
  return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center animate-pulse">
          <Package className="mx-auto mb-4 text-slate-200" size={48} />
          <p className="text-slate-400 font-medium text-sm">{text}</p>
        </div>
      </div>
    </Layout>
  );
}

function ErrorState({ message }) {
  return (
    <Layout>
      <div className="bg-red-50 border border-red-100 rounded-sm p-6">
        <div className="flex items-center gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0" size={28} />
          <div>
            <h3 className="text-base font-semibold text-red-800">{message}</h3>
            <p className="text-sm text-red-600 mt-1">
              Please refresh the page to try again
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─────────────────────────────────────────────────────────────
// Main orchestrator
// ─────────────────────────────────────────────────────────────
export default function DataListPage({ config }) {
  const {
    apiPath,
    entityKey,
    columns,
    searchColumns,
    searchFields,
    expandedContent,
    extraFilters,
    addButtonLabel = "+ Add",
    onAdd,
    onEdit,
    onDelete,
    loadingText,
    emptyText = "No records found",
  } = config;

  // ── State ──────────────────────────────────────────────────
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState(searchColumns?.[0]?.key ?? "all");
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate(); 

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `${API_URL}${apiPath}?pageNumber=1&pageSize=99999`,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setRows(json.data || []);
      } catch (e) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiPath,navigate]);

  // ── Filter ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = rows;

    // ① Text search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();

      if (searchColumns) {
        const col = searchColumns.find((c) => c.key === searchColumn);
        const fields = col?.fields ?? searchColumns[0]?.fields ?? [];
        result = result.filter((row) =>
          fields.some((f) => String(row[f] ?? "").toLowerCase().includes(lower))
        );
      } else {
        result = result.filter((row) =>
          (searchFields ?? []).some((f) => String(row[f] ?? "").toLowerCase().includes(lower))
        );
      }
    }

    // ② Extra filter (e.g. status dropdown) — provided by config.filterFn
    if (config.filterFn) result = config.filterFn(result);

    return result;
  }, [rows, searchTerm, searchColumn, searchColumns, searchFields, config]);

  // ── Pagination ─────────────────────────────────────────────
  const { paginated, totalPages } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(currentPage, pages);
    const start = (page - 1) * pageSize;
    return {
      paginated: filtered.slice(start, start + pageSize),
      totalPages: pages,
    };
  }, [filtered, currentPage, pageSize]);

  // ── Expanded row lookup ────────────────────────────────────
  const expandedRowData = expandedRow
    ? paginated.find((r) => r[entityKey] === expandedRow) ?? null
    : null;

  // ── Guard renders ──────────────────────────────────────────
  if (loading) return <LoadingState text={loadingText} />;
  if (error) return <ErrorState message={error} />;

  // ── Compose 4 sections ─────────────────────────────────────
  return (
    <Layout>
      <div className="flex flex-col gap-2 h-full overflow-hidden">

        {/* ── Section 1 : Toolbar ───────────────────────── */}
        <Toolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchColumns={searchColumns}
          filteredCount={filtered.length}
          addButtonLabel={addButtonLabel}
          onAdd={onAdd}
          extraFilters={extraFilters}
          setCurrentPage={setCurrentPage}
        />

        {/* ── Section 2 : Expanded row panel ───────────── */}
        <ExpandedPanel
          row={expandedRowData}
          entityKey={entityKey}
          expandedContent={expandedContent}
          onClose={() => setExpandedRow(null)}
        />

        {/* ── Section 3 + 4 share one white card ────────── */}
        <div className="bg-white rounded-sm border border-slate-200 overflow-hidden flex-1 min-h-0 flex flex-col">

          {/* Section 3 : Table */}
          <DataTable
            rows={paginated}
            columns={columns}
            entityKey={entityKey}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            onEdit={onEdit}
            onDelete={onDelete}
            emptyText={emptyText}
            // 🌟 เพิ่ม Props 3 ตัวนี้ลงไปครับ
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {/* Section 4 : Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            filteredCount={filtered.length}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />

        </div>
      </div>
    </Layout>
  );
}