import { useState, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  Filter,
  DoorOpen,
  Users,
  DollarSign,
  Hash,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateRoom from "./CreateRoom";
import EditRoom from "./EditRoom";

function ActiveBadge({ deleteflag }) {
  const isActive = deleteflag === "N";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
      isActive ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
    }`}>
      {isActive ? <CheckCircle size={12} className="text-green-600" /> : <XCircle size={12} className="text-red-600" />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

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

  // Dynamic API Path ตามภาษาที่เลือก
  const apiPath = `/room/${lang}`;

  const SEARCH_FIELDS = ["room_id", "details.room_detail_name"];

  const COLUMNS = [
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
    {
      header: "Status",
      cell: (room) => <ActiveBadge deleteflag={room.deleteflag || "N"} />,
    },
  ];

  function RoomExpandedContent(room) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Room Detail
          </p>
          <p className="text-sm text-slate-800 font-medium">
            {room.details?.[`room_detail_${lang}_name`] || "—"}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {room.details?.[`room_detail_${lang}_detail`] || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Operating Info
          </p>
          <p className="text-sm text-slate-800">Price: ฿{Number(room.room_price).toLocaleString()}</p>
          <p className="text-sm text-slate-500">Capacity: {room.room_capacity} คน</p>
          <p className="text-sm text-slate-500">Available: {room.room_rooms} ห้อง</p>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Story Main 1
          </p>
          <p className="text-sm text-slate-800 font-medium">
            {room.details?.[`room_detail_${lang}_storyMain1`] || "—"}
          </p>
          <p className="text-sm text-slate-500">
            {room.details?.[`room_detail_${lang}_storySub1`] || ""}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Story Main 2
          </p>
          <p className="text-sm text-slate-800 font-medium">
            {room.details?.[`room_detail_${lang}_storyMain2`] || "—"}
          </p>
          <p className="text-sm text-slate-500">
            {room.details?.[`room_detail_${lang}_storySub2`] || ""}
          </p>
        </div>
      </div>
    );
  }

  const filterFn = useCallback(
    (rows) => {
      // สามารถเพิ่มการกรองเพิ่มเติมได้ที่นี่ เช่น กรองตามราคา, สถานะ
      return rows;
    },
    [lang]
  );

  const extraFilters = useCallback(
    () => (
      <div className="relative flex-shrink-0 w-40">
        <Filter className="absolute left-2.5 top-1.5 text-slate-400" size={15} />
        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            setRefreshKey((prev) => prev + 1); // refresh เพื่อโหลดข้อมูลภาษาใหม่
          }}
          className="w-full pl-8 pr-3 py-0.5 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer bg-slate-50/50 text-sm transition-colors text-slate-600"
        >
          <option value="th">ภาษาไทย (TH)</option>
          <option value="en">English (EN)</option>
          <option value="cn">中文 (CN)</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={15} />
      </div>
    ),
    [lang]
  );

  const MENU_CONFIG = {
    apiPath: apiPath, // เปลี่ยนไปตามภาษา เช่น /room/th
    entityKey: "room_id",
    columns: COLUMNS,
    searchFields: SEARCH_FIELDS,
    expandedContent: RoomExpandedContent,
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