import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown, Filter, DoorOpen, Users, DollarSign, Hash,
  BookOpen, FileText, Info, Calendar, Moon, Sun, Loader2,
  ExternalLink,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateRoom from "./CreateRoom";
import EditRoom from "./EditRoom";
import { API_URL } from "../../variable";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

function isWeekend(d) {
  const day = d.getDay();
  return day === 5 || day === 6 || day === 0;
}

function getDayNameThai(d) {
  return ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][d.getDay()];
}

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

function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

function RoomPriceMap({ roomId, lang }) {
  const year = new Date().getFullYear();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    setExpandedMonth(null);
    Promise.all([
      fetch(`${API_URL}/price-room?room_id=${roomId}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      }).then(r => r.json()),
      fetch(`${API_URL}/price-holiday`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      }).then(r => r.json()),
    ])
      .then(([priceData, holidayData]) => {
        const map = {};
        (priceData || []).forEach(r => { map[r.price_month] = r; });
        setPrices(MONTHS.map((_, i) => {
          const m = i + 1;
          return map[m] || { price_month: m, workingday_price: "-", holiday_price: "-" };
        }));
        setHolidays(holidayData || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId, year, token]);

  const monthNames = lang === "th" ? MONTHS_TH : MONTHS;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-400">
        <Loader2 size={16} className="animate-spin mr-2" />
        <span className="text-xs">Loading prices...</span>
      </div>
    );
  }

  const setCount = prices.filter(p => Number(p.workingday_price) > 0 || Number(p.holiday_price) > 0).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400">{year}</span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-14 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(setCount / 12) * 100}%` }} />
          </div>
          <span className="text-[10px] font-medium text-slate-500 tabular-nums">{setCount}/12</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/70 bg-white overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-slate-200">
          <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">Month</div>
          <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Moon size={10} className="text-blue-500" /> WD
          </div>
          <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Sun size={10} className="text-orange-500" /> HL
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {MONTHS.map((_, i) => {
            const p = prices[i] || {};
            const isExpanded = expandedMonth === i;
            const wd = Number(p.workingday_price);
            const hl = Number(p.holiday_price);
            return (
              <div key={i}>
                <button
                  onClick={() => setExpandedMonth(isExpanded ? null : i)}
                  className="w-full grid grid-cols-[1fr_1fr_1fr] gap-px bg-slate-100 hover:bg-blue-50/50 transition-colors text-left"
                >
                  <div className="flex items-center px-3 py-1.5 bg-white">
                    <span className="text-xs font-medium text-slate-700">{monthNames[i].substring(0, 3)}</span>
                  </div>
                  <div className="flex items-center px-2 py-1.5 bg-white">
                    <span className={`text-xs font-medium ${wd > 0 ? "text-slate-800" : "text-slate-300"}`}>
                      {wd > 0 ? `฿${wd.toLocaleString()}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1.5 bg-white">
                    <span className={`text-xs font-medium ${hl > 0 ? "text-orange-600" : "text-slate-300"}`}>
                      {hl > 0 ? `฿${hl.toLocaleString()}` : "—"}
                    </span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">{monthNames[i]} {year}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Moon size={11} className="text-blue-500" /> Workingday: <strong className="text-slate-800">฿{wd > 0 ? wd.toLocaleString() : "—"}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Sun size={11} className="text-orange-500" /> Holiday: <strong className="text-slate-800">฿{hl > 0 ? hl.toLocaleString() : "—"}</strong>
                      </span>
                    </div>
                    {(() => {
                      const monthHolidays = holidays.filter(h => {
                        const d = new Date(h.specific_date);
                        return d.getMonth() === i && d.getFullYear() === year;
                      });
                      if (monthHolidays.length === 0) return null;
                      return (
                        <div className="mt-1 pt-1.5 border-t border-slate-200">
                          <p className="text-[10px] font-semibold text-slate-400 mb-1">Holidays in this month</p>
                          <div className="space-y-0.5">
                            {monthHolidays.map(h => {
                              const d = new Date(h.specific_date);
                              const w = isWeekend(d);
                              return (
                                <div key={h.holiday_id} className="flex items-center gap-1.5">
                                  <Calendar size={10} className="text-slate-400 flex-shrink-0" />
                                  <span className="text-[10px] text-slate-500">
                                    {d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                                  </span>
                                  <span className={`text-[9px] font-semibold px-1 py-0.5 rounded-full ${
                                    w ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                  }`}>
                                    {getDayNameThai(d)}
                                  </span>
                                  {h.note && <span className="text-[10px] text-slate-400">— {h.note}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate(`/admin/pricesetting?room=${roomId}`)}
        className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
      >
        <ExternalLink size={11} />
        Full Price Setting
      </button>
    </div>
  );
}

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

        <SectionCard title="Operating Info">
          <InfoRow icon={<Hash size={14} />}        label="Room ID"   value={room.room_id} mono />
          <InfoRow icon={<DollarSign size={14} />}  label="Base Price" value={`฿${Number(room.room_price).toLocaleString()}`} />
          <InfoRow icon={<Users size={14} />}       label="Capacity"  value={`${room.room_capacity} คน`} />
          <InfoRow icon={<DoorOpen size={14} />}    label="Stock"     value={`${room.room_rooms} ห้อง`} />
        </SectionCard>

        <SectionCard title="Price Map">
          <RoomPriceMap roomId={room.room_id} lang={lang} />
        </SectionCard>

        {detail && (
          <SectionCard title="Room Description">
            <InfoRow icon={<FileText size={14} />} label="Detail" value={detail} />
          </SectionCard>
        )}

        {(story1M || story1S) && (
          <SectionCard title="Story 1">
            {story1M && <InfoRow icon={<BookOpen size={14} />} label="Main" value={story1M} />}
            {story1S && <InfoRow icon={<Info size={14} />}     label="Sub"  value={story1S} />}
          </SectionCard>
        )}

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

// ─── Current Month Price ─────────────────────────────────────────────────────

function CurrentMonthPrice({ roomId }) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const token = localStorage.getItem("token");
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/price-room?room_id=${roomId}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(data => {
        const found = (data || []).find(p => p.price_month === month);
        setPrice(found || null);
      })
      .catch(() => setPrice(null));
  }, [roomId, year, month, token]);

  if (!price) {
    return (
      <div className="flex items-center gap-1.5">
        <DollarSign size={13} className="text-slate-400" />
        <span className="text-xs text-slate-400">—</span>
      </div>
    );
  }

  const wd = Number(price.workingday_price);
  const hl = Number(price.holiday_price);

  return (
    <div className="text-xs leading-relaxed">
      <div className="flex items-center gap-1 text-slate-700">
        <span className="text-[10px] font-semibold text-slate-400 w-4">WD</span>
        <span className="font-medium">{wd > 0 ? `฿${wd.toLocaleString()}` : "—"}</span>
      </div>
      <div className="flex items-center gap-1 text-slate-700">
        <span className="text-[10px] font-semibold text-orange-500 w-4">HL</span>
        <span className="font-medium">{hl > 0 ? `฿${hl.toLocaleString()}` : "—"}</span>
      </div>
    </div>
  );
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
      header: "Base Price",
      cell: (room) => <CurrentMonthPrice roomId={room.room_id} />,
    },
    {
      header: "Stock",
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