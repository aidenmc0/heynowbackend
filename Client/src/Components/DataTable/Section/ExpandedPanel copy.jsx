import { useEffect, useState, useCallback } from "react";

/**
 * ExpandedPanel.jsx — Section 2 (Non-Modal Persistent Drawer)
 * Location: src/Components/DataTable/ExpandedPanel.jsx
 *
 * Enterprise "Non-Modal" Right Drawer:
 * - NO Backdrop overlay: User can interact with the table underneath seamlessly.
 * - Instant Data Swapping: Clicking a new row instantly updates the content 
 *   without closing and reopening the drawer (No stuttering!).
 * - Smooth entry/exit only on the first open and final close.
 * - Closes via 'X' button or 'ESC' key.
 */

/**
 * @param {{
 *   row:             object | null,
 *   entityKey:       string,
 *   expandedContent: (row: object) => import('react').ReactNode,
 *   onClose:         () => void,
 * }} props
 */
export default function ExpandedPanel({ row, entityKey, expandedContent, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    if (row) {
      // If drawer is already open, just swap the data instantly (No animation reset)
      // If drawer is closed, set data and trigger slide-in animation
      if (!isVisible) {
        setCurrentRow(row);
        requestAnimationFrame(() => setIsVisible(true));
      } else {
        setCurrentRow(row); // Instant swap for seamless UX!
      }
    } else {
      // If row becomes null, trigger slide-out animation
      setIsVisible(false);
      const timer = setTimeout(() => setCurrentRow(null), 300);
      return () => clearTimeout(timer);
    }
  }, [row]);

  // Handle ESC key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  if (!currentRow) return null;

  return (
    <>
      {/* === NO BACKDROP OVERLAY === */}
      {/* We removed the backdrop so the user can click the table freely */}

      {/* === DRAWER CONTAINER === */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-full max-w-xl flex flex-col bg-white border-l border-slate-200/80 shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        role="complementary" // Changed from dialog to complementary since it's non-modal
        aria-label={`Details for ${currentRow[entityKey]}`}
      >

        {/* --- STICKY HEADER --- */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Record Details
            </h2>
            {/* Added a smooth transition for text content when row changes */}
            <h3 className="text-xl font-bold text-slate-900 truncate transition-all duration-150">
              {currentRow[entityKey]}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close details panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {expandedContent(currentRow)}
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors"
            >
              Edit Record
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}