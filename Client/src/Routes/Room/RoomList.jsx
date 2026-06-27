/**
 * RoomList.jsx — thin config wrapper
 * Location: src/Routes/Controls/Room/RoomList.jsx
 */

import { useState, useCallback } from "react";
import {
  ChevronDown, Filter, DoorOpen, Users, DollarSign, Hash,
  BookOpen, FileText, Info,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateRoom from "./CreateRoom";
import EditRoom from "./EditRoom";

// ─── Expanded Content Helpers (same pattern as Employee) ─────────────────────

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

// ─── Room Expanded Content ────────────────────────────────────────────────────
// รับ lang ผ่าน closure จาก RoomList

function makeRoomExpandedContent(lang) {
  return function RoomExpandedContent(room) {
    const name    = room.details?.[`room_detail_${lang}_name`]      || "—";
    const detail  = room.details?.[`room_detail_${lang}_detail`]    || null;
    const story1M = room.details?.[`room_detail_${lang}_storyMain1`] || null;
    const story1S = room.details?.[`room_detail_${lang}_storySub1`]  || null;
    const story2M = room.details?.[`room_detail_${lang}_storyMain2`] || null;
    const story2S = room.details?.[`room_detail_${lang}_storySub2`]  || null;

    return (
      <>
        {/* Hero Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <DoorOpen size={28} className="text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-slate-900 leading-tight truncate">{name}</h4>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{room.room_id}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                <Users size={13} className="text-slate-400" />
                {room.room_capacity} คน
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <DollarSign size={13} className="text-emerald-500" />
                ฿{Number(room.room_price).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                <Hash size={13} className="text-slate-400" />
                {room.room_rooms} ห้อง
              </span>
            </div>
          </div>
        </div>

        {/* Operating Info */}
        <SectionCard title="Operating Info">
          <InfoRow icon={<Hash size={14} />}        label="Room ID"   value={room.room_id} mono />
          <InfoRow icon={<DollarSign size={14} />}  label="Price"     value={`฿${Number(room.room_price).toLocaleString()}`} />
          <InfoRow icon={<Users size={14} />}       label="Capacity"  value={`${room.room_capacity} คน`} />
          <InfoRow icon={<DoorOpen size={14} />}    label="Stock"     value={`${room.room_rooms} ห้อง`} />
        </SectionCard>

        {/* Room Detail */}
        {detail && (
          <SectionCard title="Room Description">
            <InfoRow icon={<FileText size={14} />} label="Detail" value={detail} />
          </SectionCard>
        )}

        {/* Story 1 */}
        {(story1M || story1S) && (
          <SectionCard title="Story 1">
            {story1M && <InfoRow icon={<BookOpen size={14} />} label="Main" value={story1M} />}
            {story1S && <InfoRow icon={<Info size={14} />}     label="Sub"  value={story1S} />}
          </SectionCard>
        )}

        {/* Story 2 */}
        {(story2M || story2S) && (
          <SectionCard title="Story 2">
            {story2M && <InfoRow icon={<BookOpen size={14} />} label="Main" value={story2M} />}
            {story2S && <InfoRow icon={<Info size={14} />}     label="Sub"  value={story2S} />}
          </SectionCard>
        )}
      </>
    );
  };
}

// ─── Table Columns ────────────────────────────────────────────────────────────

function makeColumns(lang) {
  return [
    {
      header: "Room Info",
      cell: (room) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <DoorOpen size={16} className="text-slate-500" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs">
              {room.details?.[`room_detail_${lang}_name`] || "—"}
            </div>
            <div className="text-[11px] text-slate-500">{room.room_id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Capacity",
      cell: (room) => (
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-slate-400" />
          <span className="text-xs text-slate-700">{room.room_capacity} คน</span>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (room) => (
        <div className="flex items-center gap-1.5">
          <DollarSign size={13} className="text-slate-400" />
          <span className="text-xs text-slate-700 font-medium">{Number(room.room_price).toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: "Rooms Stock",
      headerClassName: "hidden lg:table-cell",
      className: "hidden lg:table-cell",
      cell: (room) => (
        <div className="flex items-center gap-1.5">
          <Hash size={13} className="text-slate-400" />
          <span className="text-xs text-slate-700">{room.room_rooms} ห้อง</span>
        </div>
      ),
    },
  ];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoomList() {
  const [lang, setLang] = useState("th");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setRefreshKey((prev) => prev + 1);
  };

  const filterFn = useCallback((rows) => rows, [lang]);

  const extraFilters = useCallback(
    () => (
      <div className="relative flex-shrink-0 w-40">
        <Filter className="absolute left-2.5 top-1.5 text-slate-400" size={15} />
        <select value={lang}
          onChange={(e) => { setLang(e.target.value); setRefreshKey((prev) => prev + 1); }}
          className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600">
          <option value="th">ภาษาไทย (TH)</option>
          <option value="en">English (EN)</option>
          <option value="cn">中文 (CN)</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={15} />
      </div>
    ),
    [lang],
  );

  const MENU_CONFIG = {
    apiPath: `/room/${lang}`,
    entityKey: "room_id",
    columns: makeColumns(lang),
    searchFields: ["room_id", "details.room_detail_name"],
    expandedContent: makeRoomExpandedContent(lang),      // ← layout ของ Room
    title: (room) => room.details?.[`room_detail_${lang}_name`] || room.room_id,
    subtitle: (room) => `฿${Number(room.room_price).toLocaleString()} · ${room.room_capacity} คน`,
    addButtonLabel: "+ Add Room",
    loadingText: "Loading Room data...",
    emptyText: "No Rooms found",
    onAdd: () => setIsModalOpen(true),
    onEdit: (room) => setEditingRoom(room),
    onDelete: (room) => console.log("Delete", room.room_id),
  };

  return (
    <>
      <DataListPage key={refreshKey} config={{ ...MENU_CONFIG, filterFn, extraFilters }} />

      {isModalOpen && (
        <CreateRoom onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
      )}
      {editingRoom && (
        <EditRoom room={editingRoom} onClose={() => setEditingRoom(null)} onSuccess={handleSuccess} />
      )}
    </>
  );
}