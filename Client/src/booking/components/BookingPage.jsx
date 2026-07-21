import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronLeft, ChevronRight, Calendar, Users,
  Home, Upload, X, FileText, CreditCard, Info, ChevronDown,
} from "lucide-react";

const ROOM_IMG = {
  "R001": "/assets/image/Rooms/Camping.jpg",
  "R002": "/assets/image/Rooms/Phruay.jpg",
  "R003": "/assets/image/Rooms/Sirilanna.jpg",
  "R004": "/assets/image/Rooms/Daramanee.jpg",
  "R005": "/assets/image/Rooms/Banchuen.jpg",
  "R006": "/assets/image/Rooms/Leelawadee.jpg",
  "R007": "/assets/image/Rooms/Katria.jpg",
  "R008": "/assets/image/Rooms/Bungalow.jpg",
};

const CONTENT_TO_DB = {
  1: "R002", 2: "R003", 3: "R004", 4: "R005",
  5: "R006", 6: "R007", 7: "R008", 8: "R001",
};
const DB_TO_CONTENT = Object.fromEntries(
  Object.entries(CONTENT_TO_DB).map(([k, v]) => [v, Number(k)])
);

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const ROOMS = [
  { id: 1, name: "Phruay House", nameTh: "บ้านพารวย", img: "/assets/image/Rooms/Phruay.jpg", desc: "A private hideaway by the water." },
  { id: 2, name: "Sirilanna House", nameTh: "บ้านสิริล้านนา", img: "/assets/image/Rooms/Sirilanna.jpg", desc: "Rustic luxury with open-air bathroom." },
  { id: 3, name: "Daramanee House", nameTh: "บ้านดารามณี", img: "/assets/image/Rooms/Daramanee.jpg", desc: "Cozy intimate setting by the stream." },
  { id: 4, name: "Ban Chuen House", nameTh: "บ้านบานชื่น", img: "/assets/image/Rooms/Banchuen.jpg", desc: "European-Asian fusion under Doi Luang." },
  { id: 5, name: "Leelawadee House", nameTh: "บ้านลีลาวดี", img: "/assets/image/Rooms/Leelawadee.jpg", desc: "Traditional Thai with modern amenities." },
  { id: 6, name: "Katria House", nameTh: "บ้านแคทรียา", img: "/assets/image/Rooms/Katria.jpg", desc: "Bohemian wooden house with mountain view." },
  { id: 7, name: "Bungalow House", nameTh: "บ้านบังกะโล", img: "/assets/image/Rooms/Bungalow.jpg", desc: "Cozy retreat with outdoor soaking tub." },
  { id: 8, name: "Camping Area", nameTh: "ลานกางเต็นท์", img: "/assets/image/Rooms/Camping.jpg", desc: "Luxury glamping under the stars." },
];

function getDatesBetween(start, end) {
  const dates = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const cur = new Date(sy, sm - 1, sd);
  const last = new Date(ey, em - 1, ed);
  while (cur < last) {
    dates.push(formatDate(cur.getFullYear(), cur.getMonth(), cur.getDate()));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(d);
  return cells;
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nightsBetween(ci, co) {
  if (!ci || !co) return 0;
  const a = new Date(ci), b = new Date(co);
  return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
}

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get("room");


  // ── State ──
  const [bookedMap, setBookedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    adults: 2, childrenFree: 0, childrenAddon: 0, petsFree: 0, detail: "",
  });
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [roomPrices, setRoomPrices] = useState({});
  const [allPriceData, setAllPriceData] = useState([]);
  const [rooms, setRooms] = useState(ROOMS);
  const fileRef = useRef(null);
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  // ── Fetch rooms from DB ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/room/en");
        const data = await res.json() || [];
        const dbMap = {};
        for (const r of data) dbMap[r.room_id] = r;
        const mapped = Object.entries(CONTENT_TO_DB).map(([cid, dbId]) => {
          const dbRoom = dbMap[dbId];
          const d = dbRoom?.details || {};
          return {
            id: Number(cid),
            dbId,
            name: d.room_detail_en_name || `Room ${dbId}`,
            nameTh: d.room_detail_th_name || dbId,
            img: ROOM_IMG[dbId] || "",
            desc: d.room_detail_en_detail || "",
          };
        });
        setRooms(mapped);
      } catch (e) {
        console.error("Failed to fetch rooms from DB", e);
      }
    })();
  }, []);

  // ── Fetch all price records on mount ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/price-room");
        const data = await res.json() || [];
        setAllPriceData(data);
      } catch (e) {
        console.error("Failed to fetch prices", e);
      }
    })();
  }, []);

  // ── Which rooms have prices for each month? ──
  // Maps DB room_id -> Set of "YYYY-MM"
  const priceExistsMap = useMemo(() => {
    const map = {};
    for (const r of allPriceData) {
      const key = `${r.price_year}-${String(r.price_month).padStart(2, "0")}`;
      if (!map[r.room_id]) map[r.room_id] = new Set();
      map[r.room_id].add(key);
    }
    return map;
  }, [allPriceData]);

  function hasPriceForDate(roomContentId, dateStr) {
    const d = new Date(dateStr);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const dbId = CONTENT_TO_DB[roomContentId];
    return !!priceExistsMap[dbId]?.has(ym);
  }

  // ── Fetch bookings ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/booking");
        const data = await res.json();
        const map = {};
        for (const b of data) {
          const dates = getDatesBetween(b.booking_checkin, b.booking_checkout);
          const ids = [b.room_id, CONTENT_TO_DB[b.room_id], DB_TO_CONTENT[b.room_id]].filter(Boolean);
          for (const id of ids) {
            const key = String(id);
            if (!map[key]) map[key] = new Set();
            for (const d of dates) map[key].add(d);
          }
        }
        setBookedMap(map);
      } catch (e) {
        console.error("Failed to load bookings", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Available rooms per date (all rooms with prices) ──
  const dailyAvailability = useMemo(() => {
    const avail = {};
    const startDate = new Date(calYear, calMonth, 1);
    const endDate = new Date(calYear, calMonth + 1, 0);
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const ds = formatDate(cur.getFullYear(), cur.getMonth(), cur.getDate());
      if (ds >= todayStr) {
        const available = rooms.filter((r) => {
          if (!hasPriceForDate(r.id, ds)) return false;
          const booked = new Set();
          for (const id of [String(r.id), CONTENT_TO_DB[r.id]].filter(Boolean)) {
            const s = bookedMap[id];
            if (s) for (const d of s) booked.add(d);
          }
          return !booked.has(ds);
        });
        avail[ds] = available;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return avail;
  }, [bookedMap, calYear, calMonth, todayStr, priceExistsMap, rooms]);

  // ── In checkout-selection mode: which dates are valid checkout for current checkin? ──
  const checkoutValidMap = useMemo(() => {
    const map = {};
    if (!checkin) return map;
    const startDate = new Date(calYear, calMonth, 1);
    const endDate = new Date(calYear, calMonth + 1, 0);
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const ds = formatDate(cur.getFullYear(), cur.getMonth(), cur.getDate());
      if (ds > checkin) {
        const rangeDates = getDatesBetween(checkin, ds);
        const ok = ROOMS.some((r) => {
          if (!rangeDates.every((d) => hasPriceForDate(r.id, d))) return false;
          const roomBooked = new Set();
          for (const id of [String(r.id), CONTENT_TO_DB[r.id]].filter(Boolean)) {
            const s = bookedMap[id];
            if (s) for (const d of s) roomBooked.add(d);
          }
          return rangeDates.every((d) => !roomBooked.has(d));
        });
        map[ds] = ok;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return map;
  }, [checkin, bookedMap, calYear, calMonth, priceExistsMap]);

  // ── Rooms available on selected range (with prices) ──
  const availableRooms = useMemo(() => {
    if (!checkin) return [];
    const endCheck = checkout || checkin;
    const rangeDates = getDatesBetween(checkin, endCheck);
    return ROOMS.filter((r) => {
      if (!rangeDates.every((d) => hasPriceForDate(r.id, d))) return false;
      const roomBooked = new Set();
      for (const id of [String(r.id), CONTENT_TO_DB[r.id]].filter(Boolean)) {
        const s = bookedMap[id];
        if (s) for (const d of s) roomBooked.add(d);
      }
      return rangeDates.every((d) => !roomBooked.has(d));
    });
  }, [checkin, checkout, bookedMap, priceExistsMap]);

  // ── Rooms with no prices set for the selected range ──
  const unPricedRooms = useMemo(() => {
    if (!checkin) return [];
    const endCheck = checkout || checkin;
    const rangeDates = getDatesBetween(checkin, endCheck);
    return ROOMS.filter((r) => {
      const isBooked = (() => {
        const roomBooked = new Set();
        for (const id of [String(r.id), CONTENT_TO_DB[r.id]].filter(Boolean)) {
          const s = bookedMap[id];
          if (s) for (const d of s) roomBooked.add(d);
        }
        return !rangeDates.every((d) => !roomBooked.has(d));
      })();
      if (isBooked) return false;
      return !rangeDates.every((d) => hasPriceForDate(r.id, d));
    });
  }, [checkin, checkout, bookedMap, priceExistsMap]);

  const nights = nightsBetween(checkin, checkout);
  const roomPrice = selectedRoom ? (roomPrices[selectedRoom.id] || 0) : 0;
  const totalPrice = roomPrice * (nights || 1);

  // ── Compute per-room nightly price from allPriceData ──
  useEffect(() => {
    if (step < 1 || !checkin || allPriceData.length === 0) return;
    const checkinYear = new Date(checkin).getFullYear();
    const checkoutYear = checkout ? new Date(checkout).getFullYear() : checkinYear;
    const years = [...new Set([checkinYear, checkoutYear])];
    const allData = {};
    for (const r of allPriceData) {
      if (years.includes(r.price_year)) {
        const key = `${r.room_id}-${r.price_year}-${r.price_month}`;
        allData[key] = r;
      }
    }
    const end = checkout || checkin;
    const dates = getDatesBetween(checkin, end);
    const roomTotals = {};
    for (const room of ROOMS) {
      let total = 0;
      for (const ds of dates) {
        const d = new Date(ds);
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const dow = d.getDay();
        const isHoliday = dow === 5 || dow === 6 || dow === 0;
        const dbId = CONTENT_TO_DB[room.id];
        const key = `${dbId}-${y}-${m}`;
        const entry = allData[key];
        const nightPrice = entry ? (isHoliday ? Number(entry.holiday_price) : Number(entry.workingday_price)) : 0;
        total += nightPrice;
      }
      roomTotals[room.id] = dates.length > 0 ? Math.round(total / dates.length) : 0;
    }
    setRoomPrices(roomTotals);
  }, [step, checkin, checkout, allPriceData]);

  const handleDateClick = useCallback((dateStr) => {
    if (dateStr < todayStr) return;
    setError(null);
    if (!checkin || (checkin && checkout)) {
      const roomsAvail = dailyAvailability[dateStr];
      if (!roomsAvail || roomsAvail.length === 0) return;
      setCheckin(dateStr);
      setCheckout("");
      setSelectedRoom(null);
      setStep(0);
    } else if (dateStr <= checkin) {
      const roomsAvail = dailyAvailability[dateStr];
      if (!roomsAvail || roomsAvail.length === 0) return;
      setCheckin(dateStr);
      setSelectedRoom(null);
      setStep(0);
    } else {
      if (checkoutValidMap[dateStr] === false) return;
      const range = getDatesBetween(checkin, dateStr);
      const allAvailable = ROOMS.filter((r) => {
        const roomBooked = new Set();
        for (const id of [String(r.id), CONTENT_TO_DB[r.id]].filter(Boolean)) {
          const s = bookedMap[id];
          if (s) for (const d of s) roomBooked.add(d);
        }
        return range.every((d) => !roomBooked.has(d));
      });
      if (allAvailable.length === 0) {
        setError("This checkout date is not available — a room is already booked for part of this period. Please choose an earlier checkout date.");
        return;
      }
      setCheckout(dateStr);
      setError(null);
    }
  }, [checkin, checkout, bookedMap, checkoutValidMap, dailyAvailability, todayStr, setError]);

  // ── Slip handling ──
  const handleSlipChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setSlipPreview(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const uploadSlip = useCallback(async (bid) => {
    if (!slipFile || !bid) return null;
    setUploading(true);
    const fd = new FormData();
    fd.append("booking_id", bid);
    fd.append("slip", slipFile);
    try {
      const res = await fetch("/upload/slip", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.path;
    } catch (e) {
      console.error("Slip upload error", e);
      return null;
    } finally {
      setUploading(false);
    }
  }, [slipFile]);

  // ── Submit booking ──
  const handleSubmit = async () => {
    if (!selectedRoom || !checkin) return;
    setSubmitting(true);
    setError(null);

    const nights = nightsBetween(checkin, checkout || checkin);
    const pricePerNight = (roomPrices[selectedRoom.id] || 0);
    const body = {
      room_id: String(selectedRoom.id),
      booking_name: form.name,
      booking_email: form.email,
      booking_phone: form.phone,
      booking_adults: form.adults,
      booking_children_free: form.childrenFree,
      booking_children_addon: form.childrenAddon,
      booking_pet_free: form.petsFree,
      booking_pet_addon: 0,
      booking_checkin: checkin,
      booking_checkout: checkout || checkin,
      booking_price: nights * pricePerNight,
      booking_detail: form.detail || "",
    };

    try {
      const res = await fetch("/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }
      const result = await res.json();
      const newId = result.booking_id;
      setBookingId(newId);
      if (slipFile) await uploadSlip(newId);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── RENDER ──

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-forest-600 mx-auto flex items-center justify-center mb-6 shadow-lg">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="font-serif text-3xl text-warm-900 mb-3">Thank You!</h2>
          <p className="text-warm-600 mb-2">Booking reference: <span className="font-mono font-bold text-forest-700">{bookingId}</span></p>
          <p className="text-warm-600 mb-8 leading-relaxed">
            Your reservation request has been received. Our team will verify availability and contact you within 24 hours.
            {slipFile && " We've received your payment slip and will confirm shortly."}
          </p>
          <button onClick={() => navigate("/")} className="inline-block bg-forest-600 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-forest-700 transition-all shadow-md">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { label: "Pick Dates", icon: Calendar },
    { label: "Choose Room", icon: Home },
    { label: "Your Info", icon: Users },
    { label: "Payment", icon: CreditCard },
    { label: "Confirm", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* ── Top Bar ── */}
      <div className="bg-warm-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/")} className="text-white/70 hover:text-white transition-colors p-1">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                i < step ? "bg-green-400 text-white" : i === step ? "bg-white text-warm-900" : "bg-white/20 text-white/50"
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-[2px] mx-1 transition-all ${i < step ? "bg-green-400" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="w-6" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <Info size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 0: Calendar Overview ── */}
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="font-serif text-3xl text-warm-900 mb-1">When are you coming?</h2>
              <p className="text-warm-500 text-sm">Pick your check-in and check-out dates</p>
            </div>
            {loading ? (
              <div className="text-center py-16 text-warm-400 text-sm">Loading availability...</div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="flex justify-center gap-3 mb-4 text-xs text-warm-600">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-200 inline-block" /> Free</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 inline-block" /> Limited</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" /> Full</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-forest-600 inline-block" /> Selected</span>
                </div>

                <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
                  {/* Month/Year Selector */}
                  <div className="flex items-center justify-between px-4 py-3 bg-warm-50 border-b border-warm-200">
                    <button onClick={() => { const d = new Date(calYear, calMonth - 1, 1); if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) { setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); } }}
                      className="p-1.5 rounded-lg hover:bg-warm-200 text-warm-600 transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                      <select value={calMonth} onChange={(e) => setCalMonth(Number(e.target.value))}
                        className="appearance-none bg-transparent font-serif text-lg font-bold text-warm-900 focus:outline-none cursor-pointer">
                        {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                      </select>
                      <select value={calYear} onChange={(e) => setCalYear(Number(e.target.value))}
                        className="appearance-none bg-transparent font-serif text-lg font-bold text-warm-900 focus:outline-none cursor-pointer">
                        {[today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2].map(y =>
                          <option key={y} value={y}>{y}</option>
                        )}
                      </select>
                    </div>
                    <button onClick={() => { const d = new Date(calYear, calMonth + 1, 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); }}
                      className="p-1.5 rounded-lg hover:bg-warm-200 text-warm-600 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                        <div key={d} className="text-[10px] font-bold text-warm-400 py-1 text-center uppercase tracking-wider">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getMonthGrid(calYear, calMonth).map((d, i) => {
                        if (d === null) return <div key={`e${i}`} />;
                        const ds = formatDate(calYear, calMonth, d);
                        const isPast = ds < todayStr;
                        const avail = dailyAvailability[ds];
                        const availCount = avail?.length || 0;
                        const isCI = ds === checkin;
                        const isCO = ds === checkout;
                        const inRange = checkin && checkout && ds > checkin && ds < checkout;
                        const isBooked = availCount === 0;
                        const isSelectingCO = checkin && !checkout; // picking checkout
                        const checkoutOk = checkoutValidMap[ds];

                        let bg = "bg-green-100 text-green-700";
                        if (isPast) bg = "bg-warm-100 text-warm-300";
                        else if (isCI || isCO) bg = "bg-forest-900 text-white shadow-md";
                        else if (inRange) bg = "bg-forest-300 text-forest-900";
                        else if (isSelectingCO && ds > checkin) bg = checkoutOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-400";
                        else if (isBooked) bg = "bg-red-100 text-red-400";
                        else if (availCount <= 2) bg = "bg-amber-100 text-amber-700";

                        return (
                          <button key={d}
                            onClick={() => handleDateClick(ds)}
                            disabled={isPast || (!checkin ? isBooked : (!checkout ? (ds > checkin && !checkoutOk) : false))}
                            className={`aspect-square rounded-xl text-sm font-medium flex flex-col items-center justify-center transition-all ${
                              (isPast || (!checkin ? isBooked : (!checkout ? (ds > checkin && !checkoutOk) : false))) ? "cursor-not-allowed opacity-60" : "hover:scale-105 hover:shadow-sm active:scale-95"
                            } ${bg}`}
                          >
                            <span className={`leading-tight ${isCI || isCO ? "font-bold text-white" : ""}`}>{d}</span>
                            {!isPast && !isCI && !isCO && !inRange && !isSelectingCO && (
                              <span className="text-[7px] mt-0.5 opacity-70 leading-tight">
                                {isBooked ? "" : `${availCount}`}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {checkin && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-warm-700 mb-3">
                      {checkout
                        ? `Selected: ${checkin} → ${checkout} (${nights} night${nights > 1 ? "s" : ""})`
                        : `Check-in: ${checkin} — now pick check-out`
                      }
                    </p>
                    {checkout && (
                      <button onClick={() => { if (availableRooms.length === 0) { setError("No rooms available for these dates."); return; } setStep(1); }}
                        className="bg-forest-600 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-forest-700 transition-all shadow-md inline-flex items-center gap-2">
                        Choose Room <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Choose Room ── */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="font-serif text-3xl text-warm-900 mb-1">Choose Your Room</h2>
              <p className="text-warm-500 text-sm">
                {checkin} → {checkout} &middot; {nights} night{nights > 1 ? "s" : ""} &middot; {availableRooms.length} room{availableRooms.length > 1 ? "s" : ""} available
              </p>
            </div>
            {availableRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-warm-500 mb-4">No rooms available for these dates.</p>
                <button onClick={() => { setCheckin(""); setCheckout(""); setStep(0); }}
                  className="text-forest-600 underline text-sm">Try different dates</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {availableRooms.map((room) => {
                  const price = roomPrices[room.id] || 0;
                  const total = price * (nights || 1);
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <button key={room.id} onClick={() => setSelectedRoom(room)}
                      className={`flex gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected ? "border-forest-600 bg-forest-50 shadow-lg ring-2 ring-forest-600/20" : "border-warm-200 bg-white hover:border-warm-300 hover:shadow-md"
                      }`}>
                      <img src={room.img} alt={room.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-warm-900">{room.name}</h3>
                        <p className="text-warm-500 text-xs mt-0.5">{room.desc}</p>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-lg font-bold text-forest-700">{price.toLocaleString()}</span>
                          <span className="text-xs text-warm-500">฿ / night</span>
                        </div>
                        <div className="text-sm text-warm-700 font-medium mt-1">
                          Total: {total.toLocaleString()} ฿
                        </div>
                        {isSelected && (
                          <div className="mt-2 text-[10px] font-semibold text-forest-600 uppercase tracking-wider flex items-center gap-1">
                            <Check size={12} /> Selected
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
                {unPricedRooms.map((room) => (
                  <div key={room.id}
                    className="flex gap-4 p-4 rounded-2xl border-2 border-warm-200 bg-warm-50 opacity-60 cursor-not-allowed">
                    <img src={room.img} alt={room.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 grayscale" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-warm-900">{room.name}</h3>
                      <p className="text-warm-500 text-xs mt-0.5">{room.desc}</p>
                      <div className="mt-2 inline-block rounded bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        ยังไม่เปิดรับจอง
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button onClick={() => selectedRoom && setStep(2)}
                disabled={!selectedRoom}
                className={`px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all shadow-md flex items-center gap-2 ${
                  selectedRoom ? "bg-forest-600 text-white hover:bg-forest-700" : "bg-warm-200 text-warm-400 cursor-not-allowed"
                }`}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Guest Info + Price Summary ── */}
        {step === 2 && selectedRoom && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Left: Form - 3 cols */}
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl text-warm-900 mb-1">Your Details</h2>
              <p className="text-warm-500 text-sm mb-6">We'll send the confirmation to this info.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Your name" className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="email@example.com" className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="+66 XX XXX XXXX" className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Guests</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-warm-500 mb-1">Adults</label>
                      <select value={form.adults} onChange={(e) => setForm({...form, adults: Number(e.target.value)})}
                        className="w-full border border-warm-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-warm-500 mb-1">Children (0-5)</label>
                      <select value={form.childrenFree} onChange={(e) => setForm({...form, childrenFree: Number(e.target.value)})}
                        className="w-full border border-warm-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20">
                        {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-warm-500 mb-1">Children (&gt;5)</label>
                      <select value={form.childrenAddon} onChange={(e) => setForm({...form, childrenAddon: Number(e.target.value)})}
                        className="w-full border border-warm-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20">
                        {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Pets</label>
                  <select value={form.petsFree} onChange={(e) => setForm({...form, petsFree: Number(e.target.value)})}
                    className="w-full border border-warm-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 max-w-[120px]">
                    {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Special Requests</label>
                  <textarea value={form.detail} onChange={(e) => setForm({...form, detail: e.target.value})}
                    rows={3} placeholder="Any special requests..." className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all" />
                </div>
              </div>
            </div>

            {/* Right: Price Summary - 2 cols */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden sticky top-24">
                <div className="bg-warm-900 text-white px-5 py-3">
                  <h3 className="font-serif text-lg">Price Summary</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-warm-100">
                    <img src={selectedRoom.img} alt={selectedRoom.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-warm-900 text-sm">{selectedRoom.name}</p>
                      <p className="text-warm-500 text-xs">{selectedRoom.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-warm-600">
                      <span>Check-in</span>
                      <span className="font-medium text-warm-900">{checkin}</span>
                    </div>
                    <div className="flex justify-between text-warm-600">
                      <span>Check-out</span>
                      <span className="font-medium text-warm-900">{checkout || checkin}</span>
                    </div>
                    <div className="flex justify-between text-warm-600">
                      <span>Nights</span>
                      <span className="font-medium text-warm-900">{nights || 1}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-warm-100 space-y-2 text-sm">
                    <div className="flex justify-between text-warm-600">
                      <span>{roomPrice.toLocaleString()} ฿ × {nights || 1} night{(nights || 1) > 1 ? "s" : ""}</span>
                      <span className="font-medium text-warm-900">{(roomPrice * (nights || 1)).toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between text-warm-500 text-xs">
                      <span>Service fee</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between text-warm-500 text-xs">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t-2 border-warm-900">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-warm-900">Total</span>
                      <span className="text-xl font-bold text-forest-700">{totalPrice.toLocaleString()} ฿</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-warm-400" />
                      <span className="text-xs text-warm-600">
                        {form.adults} Adult{form.adults > 1 ? "s" : ""}
                        {form.childrenFree + form.childrenAddon > 0 && ` · ${form.childrenFree + form.childrenAddon} Child`}
                        {form.petsFree > 0 && ` · ${form.petsFree} Pet`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Upload Payment Slip ── */}
        {step === 3 && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl text-warm-900 mb-1">Payment (Optional)</h2>
              <p className="text-warm-500 text-sm mb-6">You can pay now or pay later at the property.</p>
              <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                  <p className="font-semibold mb-1">🏦 Bank Transfer</p>
                  <p>SCB Bank &middot; Saving Account</p>
                  <p className="font-mono font-bold text-lg tracking-wider">123-4-56789-0</p>
                  <p className="text-amber-600 text-xs mt-1">Hey Now Chiang Dao Stay</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-warm-700 mb-2">Upload Payment Slip</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      slipPreview ? "border-forest-400 bg-forest-50" : "border-warm-300 hover:border-warm-400 bg-warm-50"
                    }`}
                  >
                    {slipPreview ? (
                      <div className="relative inline-block">
                        <img src={slipPreview} alt="Slip preview" className="max-h-48 rounded-lg mx-auto shadow-sm" />
                        <button onClick={(e) => { e.stopPropagation(); setSlipFile(null); setSlipPreview(null); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} className="mx-auto text-warm-400 mb-2" />
                        <p className="text-sm text-warm-600 font-medium">Click to upload slip</p>
                        <p className="text-xs text-warm-400 mt-1">JPG, PNG, or PDF (max 10MB)</p>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleSlipChange} className="hidden" />
                  </div>
                </div>
                <div className="text-xs text-warm-400 flex items-start gap-2">
                  <Info size={14} className="mt-0.5 flex-shrink-0" />
                  <span>You can also pay upon arrival. A slip is not required to complete the booking.</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden sticky top-24">
                <div className="bg-warm-900 text-white px-5 py-3">
                  <h3 className="font-serif text-lg">Booking Summary</h3>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex items-center gap-3 pb-3 border-b border-warm-100">
                    <img src={selectedRoom.img} alt={selectedRoom.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-warm-900">{selectedRoom.name}</p>
                      <p className="text-warm-500 text-xs">{checkin} → {checkout || checkin}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-warm-600">
                    <span>Room</span>
                    <span className="font-medium text-warm-900">{roomPrice.toLocaleString()} ฿</span>
                  </div>
                  <div className="flex justify-between text-warm-600">
                    <span>Nights</span>
                    <span className="font-medium text-warm-900">{nights || 1}</span>
                  </div>
                  <div className="pt-2 border-t border-warm-100 flex justify-between font-bold text-warm-900">
                    <span>Total</span>
                    <span className="text-lg text-forest-700">{totalPrice.toLocaleString()} ฿</span>
                  </div>
                  <div className="pt-2 text-xs text-warm-400">
                    <p>Name: {form.name || "—"}</p>
                    <p>Phone: {form.phone || "—"}</p>
                    <p>Guests: {form.adults} Adult{form.adults > 1 ? "s" : ""}{form.childrenFree + form.childrenAddon > 0 ? `, ${form.childrenFree + form.childrenAddon} Child` : ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirm ── */}
        {step === 4 && selectedRoom && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl text-warm-900 mb-1 text-center">Review & Confirm</h2>
            <p className="text-warm-500 text-sm mb-6 text-center">Please verify everything before submitting.</p>
            <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-forest-700 to-forest-600 text-white px-6 py-4">
                <div className="flex items-center gap-4">
                  <img src={selectedRoom.img} alt={selectedRoom.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/30" />
                  <div>
                    <h3 className="font-serif text-xl">{selectedRoom.name}</h3>
                    <p className="text-white/70 text-sm">{checkin} → {checkout || checkin} · {nights || 1} night{(nights || 1) > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold">Guest</p>
                    <p className="font-medium text-warm-900">{form.name}</p>
                  </div>
                  <div>
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold">Phone</p>
                    <p className="font-medium text-warm-900">{form.phone}</p>
                  </div>
                  {form.email && (
                    <div className="col-span-2">
                      <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold">Email</p>
                      <p className="font-medium text-warm-900">{form.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold">Guests</p>
                    <p className="font-medium text-warm-900">{form.adults} Adults · {form.childrenFree + form.childrenAddon} Children · {form.petsFree} Pets</p>
                  </div>
                  <div>
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold">Total</p>
                    <p className="font-bold text-lg text-forest-700">{totalPrice.toLocaleString()} ฿</p>
                  </div>
                </div>
                {form.detail && (
                  <div className="pt-3 border-t border-warm-100">
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Special Requests</p>
                    <p className="text-sm text-warm-700 italic">"{form.detail}"</p>
                  </div>
                )}
                {slipPreview && (
                  <div className="pt-3 border-t border-warm-100">
                    <p className="text-warm-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Payment Slip</p>
                    <img src={slipPreview} alt="Slip" className="h-20 rounded-lg shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="px-6 py-3 rounded-full border border-warm-300 text-warm-700 text-sm hover:bg-warm-100 transition-all">
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <div className="text-xs text-warm-400">
            Step {step + 1} of {steps.length}
          </div>
          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 0 && checkin && checkout) setStep(1);
                else if (step === 1 && selectedRoom) setStep(2);
                else if (step === 2 && form.name && form.phone) setStep(3);
                else if (step === 3) setStep(4);
                else if (!checkin || !checkout) setError("Please select your dates first.");
                else if (!selectedRoom) setError("Please select a room.");
                else if (!form.name || !form.phone) setError("Please provide your name and phone number.");
              }}
              className={`px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all shadow-md flex items-center gap-2 ${
                (step === 0 && checkin && checkout) ||
                (step === 1 && selectedRoom) ||
                (step === 2 && form.name && form.phone) ||
                step === 3
                  ? "bg-forest-600 text-white hover:bg-forest-700"
                  : "bg-warm-200 text-warm-400 cursor-not-allowed"
              }`}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || uploading}
              className="px-8 py-3 rounded-full text-sm tracking-widest uppercase bg-forest-600 text-white hover:bg-forest-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
              {submitting || uploading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {uploading ? "Uploading..." : "Booking..."}</>
              ) : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
