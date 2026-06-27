import { useEffect, useState, useCallback } from "react";
import { X, Pencil } from "lucide-react";

/**
 * ExpandedPanel.jsx — Generic Non-Modal Persistent Drawer
 * Location: src/Components/DataTable/ExpandedPanel.jsx
 *
 * ไม่มี logic ตรวจ entity type ใดๆ ทั้งนั้น
 * แต่ละ List page รับผิดชอบ expandedContent ของตัวเอง
 *
 * Optional props เพิ่มเติม:
 *   title(row)    => string  — override header title (default: row[entityKey])
 *   subtitle(row) => string  — แสดง subtitle ใต้ title
 *   onEdit(row)             — ถ้าส่งมา จะแสดงปุ่ม Edit Record
 */
export default function ExpandedPanel({
  row,
  entityKey,
  expandedContent,
  onClose,
  onEdit,
  title,
  subtitle,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    if (row) {
      if (!isVisible) {
        setCurrentRow(row);
        requestAnimationFrame(() => setIsVisible(true));
      } else {
        setCurrentRow(row); // instant swap
      }
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setCurrentRow(null), 300);
      return () => clearTimeout(timer);
    }
  }, [row]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  if (!currentRow) return null;

  const displayTitle = title ? title(currentRow) : currentRow[entityKey];
  const displaySubtitle = subtitle ? subtitle(currentRow) : null;

  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-full max-w-md flex flex-col bg-slate-50 border-l border-slate-200 shadow-[-12px_0_40px_-8px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      role="complementary"
      aria-label={`Details for ${currentRow[entityKey]}`}
    >
      {/* ── Sticky Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            Record Details
          </p>
          <h3 className="text-lg font-bold text-slate-900 truncate leading-tight">
            {displayTitle}
          </h3>
          {displaySubtitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{displaySubtitle}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Close details panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {expandedContent(currentRow)}
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      <div className="px-5 py-3.5 border-t border-slate-200 bg-white sticky bottom-0">
        <div className="flex justify-end gap-2.5">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => { onEdit(currentRow); handleClose(); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors shadow-sm"
            >
              <Pencil size={14} />
              Edit Record
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}