import { useRef, useState, useEffect } from "react";
import { Package, Eye, Edit2, Trash2 } from "lucide-react";

function ActionButtons({ row, entityKey, expandedRow, setExpandedRow, onEdit, onDelete }) {
  const ie = expandedRow === row[entityKey];
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
      <button onClick={() => setExpandedRow(ie ? null : row[entityKey])}
        className={`p-1.5 transition-colors duration-150 ${ie ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`} title="View details">
        <Eye size={14} />
      </button>
      <div className="w-px h-4 bg-slate-100" />
      <button onClick={() => onEdit?.(row)}
        className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150" title="Edit">
        <Edit2 size={14} />
      </button>
      <div className="w-px h-4 bg-slate-100" />
      <button onClick={() => onDelete?.(row)}
        className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150" title="Delete">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function DataTable({
  rows, columns, entityKey, expandedRow, setExpandedRow,
  onEdit, onDelete, emptyText = "No records found",
  currentPage, totalPages, setCurrentPage,
}) {
  const rootRef = useRef(null);
  const rowRefs = useRef({});
  const colW = useRef({});
  const inited = useRef(false);
  const rs = useRef(null);
  const [, re] = useState(0);

  useEffect(() => {
    if (inited.current || columns.length === 0) return;
    const el = rootRef.current;
    if (!el || !el.parentElement) return;
    const w = el.parentElement.getBoundingClientRect().width;
    if (w <= 0) return;
    inited.current = true;
    const avail = w - 96;
    const each = Math.max(100, Math.floor(avail / columns.length));
    columns.forEach((_, i) => { colW.current[i] = each; });
    re(n => n + 1);
  }, [columns.length]);

  const hasW = inited.current;

  const onResize = (e, ci) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inited.current) {
      const el = rootRef.current?.parentElement;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      inited.current = true;
      const avail = w - 96;
      const each = Math.max(100, Math.floor(avail / columns.length));
      columns.forEach((_, i) => { colW.current[i] = each; });
    }

    const th = rootRef.current?.querySelectorAll("thead th:not(:last-child)")?.[ci];
    rs.current = { ci, sx: e.clientX, sw: th?.offsetWidth || 100 };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const mm = (ev) => {
      if (!rs.current) return;
      const { ci, sx, sw } = rs.current;
      colW.current[ci] = Math.max(60, sw + (ev.clientX - sx));
      re(n => n + 1);
    };
    const mu = () => {
      rs.current = null;
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
  };

  const sumW = columns.reduce((s, _, i) => s + (colW.current[i] || 0), 0);
  const tableW = hasW ? sumW + 96 : undefined;

  const hKD = (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    if (e.key === "ArrowLeft") { if (currentPage > 1) setCurrentPage(p => Math.max(1, p - 1)); return; }
    if (e.key === "ArrowRight") { if (currentPage < totalPages) setCurrentPage(p => Math.min(totalPages, p + 1)); return; }
    if (rows.length === 0) return;
    const ci = rows.findIndex(r => r[entityKey] === expandedRow);
    let ni = ci;
    if (e.key === "ArrowDown") ni = ci === -1 ? 0 : Math.min(ci + 1, rows.length - 1);
    if (e.key === "ArrowUp") ni = Math.max(ci - 1, 0);
    if (ni !== ci) {
      setExpandedRow(rows[ni][entityKey]);
      rowRefs.current[rows[ni][entityKey]]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const thStyle = (i) => {
    const w = colW.current[i];
    if (w) return { width: w + "px", minWidth: w + "px" };
    if (hasW) return { width: "1px", minWidth: "100px" };
    return { minWidth: "100px" };
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={hKD}
      className="outline-none overflow-x-auto overflow-y-auto flex-1 min-w-0"
      onClick={() => rootRef.current?.focus()}
    >
      <table className="table-fixed" role="grid" style={hasW ? { width: tableW + "px" } : { minWidth: "100%" }}>
        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
          <tr className="text-left">
            {columns.map((col, i) => (
              <th key={i}
                className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap select-none relative ${col.headerClassName ?? ""}`}
                style={thStyle(i)}>
                {col.header}
                <div onMouseDown={(e) => onResize(e, i)}
                  className="absolute top-1 right-0 w-[5px] h-[calc(100%-8px)] cursor-col-resize hover:bg-blue-400 active:bg-blue-500 rounded-sm transition-colors z-10" />
              </th>
            ))}
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right w-[96px] sticky right-0 bg-slate-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] z-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="text-center py-16 bg-white">
              <Package className="mx-auto mb-3 text-slate-200" size={40} />
              <p className="text-slate-400 font-medium text-sm">{emptyText}</p>
            </td></tr>
          ) : rows.map((row, idx) => {
            const ie = expandedRow === row[entityKey];
            return (
              <tr key={`${row[entityKey]}-${idx}`}
                ref={el => rowRefs.current[row[entityKey]] = el}
                onClick={() => setExpandedRow(ie ? null : row[entityKey])}
                className={`cursor-pointer transition-colors duration-150 ${ie ? "bg-indigo-50/70" : "hover:bg-indigo-50/30"}`}
                aria-selected={ie}>
                {columns.map((col, i) => (
                  <td key={i}
                    className={`px-4 py-2.5 whitespace-nowrap text-slate-700 text-xs transition-all duration-150 ${
                      i === 0 ? (ie ? "border-l-4 border-l-red-500" : "border-l-4 border-l-transparent") : ""
                    } ${col.className ?? ""}`}
                    style={thStyle(i)}>
                    {col.cell(row)}
                  </td>
                ))}
                <td className="px-4 py-2.5 whitespace-nowrap text-right sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]"
                  onClick={e => e.stopPropagation()}>
                  <ActionButtons row={row} entityKey={entityKey} expandedRow={expandedRow}
                    setExpandedRow={setExpandedRow} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}