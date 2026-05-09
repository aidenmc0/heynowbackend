import { useRef } from "react";
import { Package, Eye, Edit2, Trash2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Action button group  (View / Edit / Delete)
// ─────────────────────────────────────────────────────────────
function ActionButtons({ row, entityKey, expandedRow, setExpandedRow, onEdit, onDelete }) {
  const isExpanded = expandedRow === row[entityKey];

  return (
    <div className="inline-flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
      <button
        onClick={() =>
          setExpandedRow(isExpanded ? null : row[entityKey])
        }
        className={`p-1.5 transition-colors duration-150 ${isExpanded
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          }`}
        title="View details"
      >
        <Eye size={14} />
      </button>

      <div className="w-px h-4 bg-slate-100" />

      <button
        onClick={() => onEdit?.(row)}
        className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
        title="Edit"
      >
        <Edit2 size={14} />
      </button>

      <div className="w-px h-4 bg-slate-100" />

      <button
        onClick={() => onDelete?.(row)}
        className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────
export default function DataTable({
  rows,
  columns,
  entityKey,
  expandedRow,
  setExpandedRow,
  onEdit,
  onDelete,
  emptyText = "No records found",
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  const handleKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();

    if (e.key === "ArrowLeft") {
      if (currentPage > 1) setCurrentPage((p) => Math.max(1, p - 1));
      return;
    }
    if (e.key === "ArrowRight") {
      if (currentPage < totalPages) setCurrentPage((p) => Math.min(totalPages, p + 1));
      return;
    }

    if (rows.length === 0) return;

    const currentIndex = rows.findIndex((r) => r[entityKey] === expandedRow);
    let nextIndex = currentIndex;

    if (e.key === "ArrowDown") {
      nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, rows.length - 1);
    } else if (e.key === "ArrowUp") {
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex !== currentIndex) {
      const newRow = rows[nextIndex];
      setExpandedRow(newRow[entityKey]);
      const rowEl = rowRefs.current[newRow[entityKey]];
      rowEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  return (
    <div
      ref={tableContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none rounded-sm overflow-x-auto overflow-y-auto flex-1"
      onClick={() => tableContainerRef.current?.focus()}
    >
      {/* 🌟 เอา border-separate ออก กลับไปใช้ค่า default ของ table */}
      <table className="w-full" role="grid">

        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
          <tr className="text-left">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap ${col.headerClassName ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right w-24">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-16 bg-white">
                <Package className="mx-auto mb-3 text-slate-200" size={40} />
                <p className="text-slate-400 font-medium text-sm">{emptyText}</p>
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => {
              const isExpanded = expandedRow === row[entityKey];
              return (
                <tr
                  key={`${row[entityKey]}-${idx}`}
                  ref={el => rowRefs.current[row[entityKey]] = el}
                  onClick={() =>
                    setExpandedRow(isExpanded ? null : row[entityKey])
                  }
                  className={`cursor-pointer transition-colors duration-150 ${isExpanded
                    ? "bg-indigo-50/70"
                    : "hover:bg-indigo-50/30"
                    }`}
                  aria-selected={isExpanded}
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2.5 whitespace-nowrap text-slate-700 text-xs transition-all duration-150 ${
                        // 🌟 Magic Here: ใส่ขอบซ้ายที่คอลัมน์แรกสุด (i === 0) เท่านั้น!
                        i === 0
                          ? (isExpanded
                            ? "border-l-4 border-l-red-500"
                            : "border-l-4 border-l-transparent") // ใส่ขอบโปร่งใส่ล็อกพื้นที่ไว้ กันตัวหนังสือกระตุกเวลาคลิก
                          : ""
                        } ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}

                  <td
                    className="px-4 py-2.5 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionButtons
                      row={row}
                      entityKey={entityKey}
                      expandedRow={expandedRow}
                      setExpandedRow={setExpandedRow}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}