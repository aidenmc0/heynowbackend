import { useState, useEffect, useCallback } from "react";
import {
  DollarSign, Sun, Moon, Plus, Trash2, CalendarDays,
  Save, Loader2, Check, ChevronDown, Building, Calendar,
} from "lucide-react";
import { Layout } from "../../Components/Layouts/Layout";
import { API_URL } from "../../variable";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ROOMS = [
  { id: "R001", name: "R001 — Phruay" },
  { id: "R002", name: "R002 — Sirilanna" },
  { id: "R003", name: "R003 — Daramanee" },
  { id: "R004", name: "R004 — Ban Chuen" },
  { id: "R005", name: "R005 — Leelawadee" },
  { id: "R006", name: "R006 — Katria" },
  { id: "R007", name: "R007 — Bungalow" },
  { id: "R008", name: "R008 — Camping" },
];

const YEARS = () => {
  const y = new Date().getFullYear();
  return [y - 1, y, y + 1, y + 2, y + 3];
};

function getDayNameThai(d) {
  return ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][d.getDay()];
}

function isWeekend(d) {
  const day = d.getDay();
  return day === 5 || day === 6 || day === 0;
}

export default function PriceSetting() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [activeTab, setActiveTab] = useState("prices");
  const [selectedRoom, setSelectedRoom] = useState("R001");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [holidays, setHolidays] = useState([]);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayNote, setHolidayNote] = useState("");

  const setCount = prices.filter((p) => Number(p.workingday_price) > 0 || Number(p.holiday_price) > 0).length;

  const fetchPrices = useCallback(async (roomId, year) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/price-room?room_id=${roomId}&year=${year}`, { headers: authHeaders });
      const data = await res.json();
      const map = {};
      (data || []).forEach((r) => { map[r.price_month] = r; });
      setPrices(MONTHS.map((_, i) => {
        const m = i + 1;
        return map[m] || { price_month: m, workingday_price: "", holiday_price: "" };
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHolidays = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/price-holiday`, { headers: authHeaders });
      setHolidays((await res.json()) || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchPrices(selectedRoom, selectedYear); }, [selectedRoom, selectedYear, fetchPrices]);
  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

  const updatePrice = (month, field, value) => {
    setPrices((prev) => prev.map((p) =>
      p.price_month === month ? { ...p, [field]: Number(value) || 0 } : p
    ));
    setSaved(false);
  };

  const savePrices = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/price-room/batch`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          room_id: selectedRoom,
          price_year: selectedYear,
          prices: prices.map((p) => ({
            price_month: p.price_month,
            workingday_price: p.workingday_price || 0,
            holiday_price: p.holiday_price || 0,
          })),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const addHoliday = async () => {
    if (!holidayDate) return;
    try {
      const res = await fetch(`${API_URL}/price-holiday`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ specific_date: holidayDate, note: holidayNote }),
      });
      if (!res.ok) throw new Error("Add failed");
      setHolidayDate("");
      setHolidayNote("");
      fetchHolidays();
    } catch (e) {
      alert("Failed: " + e.message);
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await fetch(`${API_URL}/price-holiday/${id}`, { method: "DELETE", headers: authHeaders });
      fetchHolidays();
    } catch (e) {
      alert("Failed: " + e.message);
    }
  };

  const copyFromYear = async (fromYear) => {
    if (!confirm(`Copy prices from ${fromYear} to ${selectedYear} for ${selectedRoom}?`)) return;
    try {
      const res = await fetch(`${API_URL}/price-room?room_id=${selectedRoom}&year=${fromYear}`, { headers: authHeaders });
      const data = await res.json();
      const map = {};
      (data || []).forEach((r) => { map[r.price_month] = r; });
      const filled = MONTHS.map((_, i) => {
        const m = i + 1;
        const src = map[m];
        return {
          price_month: m,
          workingday_price: src?.workingday_price || "",
          holiday_price: src?.holiday_price || "",
        };
      });
      setPrices(filled);
      setSaved(false);
    } catch (e) {
      alert("Copy failed: " + e.message);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden">

        {/* ─── Header ─── */}
        <div className="flex-shrink-0 px-3 md:px-5 pt-3 md:pt-4 pb-2 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Price Setting</h1>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("prices")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "prices"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <DollarSign size={13} /> Prices
              </button>
              <button
                onClick={() => setActiveTab("holidays")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "holidays"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Sun size={13} /> Holidays
              </button>
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3 md:py-4">
          <div className="max-w-6xl mx-auto">

            {/* ════════ TAB: ROOM PRICES ════════ */}
            {activeTab === "prices" && (
              <div className="space-y-3">

                {/* Selectors Row */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none sm:w-44">
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700
                        focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 shadow-sm transition-all"
                    >
                      {ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative w-20">
                    <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full appearance-none pl-7 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700
                        focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 shadow-sm transition-all"
                    >
                      {YEARS().map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {/* Copy from previous year */}
                  {YEARS().includes(selectedYear - 1) && (
                    <button
                      onClick={() => copyFromYear(selectedYear - 1)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all whitespace-nowrap"
                      title={`Copy from ${selectedYear - 1}`}
                    >
                      Copy from {selectedYear - 1}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <div className="h-1.5 w-14 sm:w-20 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(setCount / 12) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 tabular-nums">{setCount}/12</span>
                  </div>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Loader2 size={24} className="animate-spin mb-2 text-slate-300" />
                    <p className="text-xs">Loading prices...</p>
                  </div>
                ) : (
                  <>
                    {/* ── Mobile/Tablet: Card Layout ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:hidden">
                      {MONTHS.map((name, i) => {
                        const p = prices[i] || {};
                        return (
                          <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white p-2.5 shadow-sm transition-all hover:shadow-md">
                            <div className="flex-shrink-0 w-14">
                              <p className="text-[11px] font-semibold text-slate-700 leading-tight">{name.substring(0, 3)}</p>
                            </div>
                            <div className="flex-1 flex items-center gap-1.5 min-w-0">
                              <input
                                type="number" min={0}
                                value={p.workingday_price ?? ""}
                                onChange={(e) => updatePrice(i + 1, "workingday_price", e.target.value)}
                                className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                placeholder="WD"
                              />
                              <input
                                type="number" min={0}
                                value={p.holiday_price ?? ""}
                                onChange={(e) => updatePrice(i + 1, "holiday_price", e.target.value)}
                                className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700
                                  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                                placeholder="HL"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ── Desktop: Table Layout ── */}
                    <div className="hidden lg:block rounded-xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-slate-200">
                        <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Month</div>
                        <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                          <Moon size={11} className="text-blue-500" /> Workingday
                        </div>
                        <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                          <Sun size={11} className="text-orange-500" /> Holiday
                        </div>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {MONTHS.map((name, i) => {
                          const p = prices[i] || {};
                          return (
                            <div key={i} className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-slate-100 even:bg-slate-50 transition-colors hover:bg-slate-50/50">
                              <div className="flex items-center px-4 py-2 bg-white">
                                <p className="text-xs font-semibold text-slate-700">{name}</p>
                              </div>
                              <div className="flex items-center px-2 py-1.5 bg-white">
                                <input
                                  type="number" min={0}
                                  value={p.workingday_price ?? ""}
                                  onChange={(e) => updatePrice(i + 1, "workingday_price", e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                  placeholder="0"
                                />
                              </div>
                              <div className="flex items-center px-2 py-1.5 bg-white">
                                <input
                                  type="number" min={0}
                                  value={p.holiday_price ?? ""}
                                  onChange={(e) => updatePrice(i + 1, "holiday_price", e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700
                                    focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Sticky Save Bar (mobile) ── */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 z-10 flex items-center justify-between gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                      <span className="text-[11px] text-slate-400">{selectedRoom} · {selectedYear}</span>
                      <button
                        onClick={savePrices}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                        {saving ? "Saving..." : saved ? "Saved" : "Save"}
                      </button>
                    </div>

                    <div className="hidden lg:flex justify-end pt-1">
                      <button
                        onClick={savePrices}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                        {saving ? "Saving..." : saved ? "Saved!" : `Save ${selectedYear}`}
                      </button>
                    </div>

                    <div className="lg:hidden h-14" />
                  </>
                )}
              </div>
            )}

            {/* ════════ TAB: HOLIDAY OVERRIDE ════════ */}
            {activeTab === "holidays" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

                <div className="lg:col-span-2 rounded-xl border border-slate-200/70 bg-white shadow-sm p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">Add Holiday</h3>
                  <div>
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700
                        focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={holidayNote}
                      onChange={(e) => setHolidayNote(e.target.value)}
                      placeholder="Note..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs
                        focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
                    />
                  </div>
                  <button
                    onClick={addHoliday}
                    disabled={!holidayDate}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 text-white text-xs font-bold transition-all"
                  >
                    <Plus size={13} /> Add Holiday
                  </button>
                </div>

                <div className="lg:col-span-3 rounded-xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700">
                      Holidays
                      {holidays.length > 0 && <span className="ml-1.5 text-[10px] font-normal text-slate-400">({holidays.length})</span>}
                    </h3>
                  </div>
                  {holidays.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Sun size={24} className="mb-2 text-slate-300" />
                      <p className="text-xs">No holidays added</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                      {holidays.map((h) => {
                        const d = new Date(h.specific_date);
                        const w = isWeekend(d);
                        return (
                          <div key={h.holiday_id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition-colors group">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <CalendarDays size={12} className="text-slate-400 flex-shrink-0" />
                                <span className="text-xs font-semibold text-slate-700">
                                  {d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                                </span>
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                  w ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                  {getDayNameThai(d)}
                                </span>
                              </div>
                              {h.note && <p className="text-[11px] text-slate-400 mt-0.5 ml-5 line-clamp-1">{h.note}</p>}
                            </div>
                            <button
                              onClick={() => deleteHoliday(h.holiday_id)}
                              className="flex-shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
