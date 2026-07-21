import { useState, useMemo, useEffect, useRef } from "react";

// ── Helpers ───────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const parseDate = (key) => { if (!key) return null; const [y,m,d] = key.split('-').map(Number); return new Date(y, m-1, d); };
const nightsBetween = (from, to) => { if (!from || !to) return 0; return Math.round((parseDate(to) - parseDate(from)) / 86400000); };
const formatDate = (key) => { if (!key) return ""; const d = parseDate(key); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`; };
const formatTHB = (n) => `฿${n.toLocaleString('th-TH')}`;
const genId = () => 'BK-' + Math.random().toString(36).slice(2,8).toUpperCase();

// ── Mock Booked Dates ─────────────────────────────────────────────────
const genBooked = () => {
  const s = new Set(); const t = new Date();
  for (let i = 0; i < 90; i++) { if (Math.random() < 0.25) { const d = new Date(t); d.setDate(d.getDate()+i); s.add(toKey(d.getFullYear(), d.getMonth(), d.getDate())); } }
  return [...s];
};

// ── Room Data ─────────────────────────────────────────────────────────
const ROOMS = [
  { id:"R001", capacity:1,  price:500,  rooms:50, priceChildren:300, petAllowed:false, nameTH:"ลานกางเต็นท์",   nameEN:"Camping Area",      img:"/assets/image/Rooms/Camping/image1.jpg", type:"camping", icon:"🏕️", amenities:["Shared Facilities","Fire Pit","BBQ Area"], desc:"Open-air camping ground surrounded by nature." },
  { id:"R002", capacity:4,  price:4500, rooms:1,  priceChildren:300, petAllowed:false, nameTH:"บ้านพารวย",       nameEN:"Phruay House",       img:"/assets/image/Rooms/Phruay/image1.jpg", type:"house", icon:"🏡", amenities:["Air Conditioning","Kitchen","Parking"], desc:"Spacious 4-guest house with full kitchen and private parking." },
  { id:"R003", capacity:4,  price:4500, rooms:2,  priceChildren:300, petAllowed:false, nameTH:"บ้านสิริล้านนา", nameEN:"Sirilanna House",     img:"/assets/image/Rooms/Sirilanna/image1.jpg", type:"house", icon:"🏡", amenities:["Lanna Décor","Mountain View","2 Bedrooms"], desc:"Traditional Lanna-style home with panoramic mountain views." },
  { id:"R004", capacity:2,  price:4500, rooms:1,  priceChildren:300, petAllowed:false, nameTH:"บ้านดารามณี",    nameEN:"Daramanee House",    img:"/assets/image/Rooms/Daramanee/image1.jpg", type:"house", icon:"🏡", amenities:["Private Garden","Rain Shower","Hammock"], desc:"Intimate 2-guest retreat with a serene private garden." },
  { id:"R005", capacity:2,  price:4500, rooms:1,  priceChildren:300, petAllowed:false, nameTH:"บ้านบานชื่น",    nameEN:"Ban Chuen House",    img:"/assets/image/Rooms/Banchuen/image1.jpg", type:"house", icon:"🏡", amenities:["Tropical Garden","Outdoor Bath","Bamboo Décor"], desc:"A cheerful 2-guest cottage nestled in tropical bamboo gardens." },
  { id:"R006", capacity:3,  price:3500, rooms:1,  priceChildren:300, petAllowed:false, nameTH:"บ้านลีลาวดี",    nameEN:"Leelawadee House",   img:"/assets/image/Rooms/Leelawadee/image1.jpg", type:"house", icon:"🏡", amenities:["Plumeria Garden","Terrace","Free Breakfast"], desc:"3-guest house surrounded by plumeria blossoms and a sunny terrace." },
  { id:"R007", capacity:4,  price:6000, rooms:2,  priceChildren:300, petAllowed:false, nameTH:"บ้านแคทรียา",   nameEN:"Katria House",       img:"/assets/image/Rooms/Katria/image1.jpg", type:"villa", icon:"🏠", amenities:["Private Pool","2 Bedrooms","Premium Kitchen"], desc:"Luxury 4-guest villa with private pool and premium finishes." },
  { id:"R008", capacity:2,  price:1500, rooms:1,  priceChildren:300, petAllowed:false, nameTH:"บ้านบังกะโล",   nameEN:"Bungalow House",     img:"/assets/image/Rooms/Bungalow/image1.jpg", type:"bungalow", icon:"🛖", amenities:["Forest Deck","Outdoor Shower","Cozy Interior"], desc:"Charming teak bungalow set in a peaceful forest setting." },
  { id:"R009", capacity:2,  price:4500, rooms:1,  priceChildren:300, petAllowed:true,  petPrice:300, nameTH:"บ้านเพรชจรัล",  nameEN:"Petcharan House",    img:"/assets/image/Rooms/Daramanee/image1.jpg", type:"house", icon:"🐾", amenities:["Pet Friendly","Private Garden","Dog Wash Station"], desc:"Our only pet-friendly property with a dedicated dog wash station." },
].map(r => ({ ...r, bookedDates: genBooked() }));

// ── Palette ───────────────────────────────────────────────────────────
const P = {
  bg: "#F8F5F0", surface: "#FFFFFF", surfaceAlt: "#F3EFE9",
  border: "#E2D9CF", borderStrong: "#C8B9A8",
  text: "#1E1A17", textMid: "#6B5D52", textLight: "#9C8C80",
  accent: "#7B5E3A", accentLight: "#A07848", accentBg: "#FFF8F0",
  sage: "#5E7A5E", sageBg: "#EBF2EB",
  red: "#9B3535", redBg: "#FDECEA",
  amber: "#8A6A1A", amberBg: "#FFF8E1",
  inRange: "#F5EDE0",
};

// ── Shared Styles ─────────────────────────────────────────────────────
const SS = {
  card: { background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16, overflow: "hidden" },
  input: {
    width: "100%", boxSizing: "border-box", background: P.surface, border: `1.5px solid ${P.border}`,
    borderRadius: 10, padding: "12px 16px", fontSize: 14, color: P.text,
    fontFamily: "inherit", outline: "none", transition: "border-color 0.2s",
  },
  btnPrimary: {
    background: P.accent, color: "#FFF", border: "none", padding: "13px 28px", borderRadius: 10,
    fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%", transition: "background 0.2s",
  },
  btnGhost: {
    background: "transparent", color: P.accent, border: `1.5px solid ${P.borderStrong}`,
    padding: "10px 20px", borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: "pointer",
  },
  counterBtn: {
    width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${P.borderStrong}`,
    background: "transparent", fontSize: 18, cursor: "pointer", color: P.accent,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  label: { fontSize: 12, fontWeight: 600, color: P.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: P.text, marginBottom: 16 },
};

// ── Step Pill ─────────────────────────────────────────────────────────
const StepPill = ({ current }) => {
  const steps = ["Dates", "Room", "Guests", "Confirm"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = current > idx, active = current === idx;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 24,
              background: active ? P.accent : done ? P.accentBg : "transparent",
              border: `1.5px solid ${active ? P.accent : done ? P.accentLight : P.border}`,
              color: active ? "#FFF" : done ? P.accentLight : P.textLight,
              fontSize: 13, fontWeight: active ? 600 : 400,
            }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: active ? "rgba(255,255,255,0.25)" : done ? P.accentLight : P.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: active ? "#FFF" : done ? "#FFF" : P.textLight }}>
                {done ? "✓" : idx}
              </span>
              {s}
            </div>
            {i < 3 && <div style={{ width: 20, height: 1.5, background: current > idx+1 ? P.accentLight : P.border }} />}
          </div>
        );
      })}
    </div>
  );
};

// ── Calendar ──────────────────────────────────────────────────────────
const Calendar = ({ checkIn, checkOut, onDateClick, blockedDates = [] }) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [vy, setVy] = useState(today.getFullYear());
  const [vm, setVm] = useState(today.getMonth());
  const firstDay = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();

  const prevMonth = () => vm === 0 ? (setVm(11), setVy(vy-1)) : setVm(vm-1);
  const nextMonth = () => vm === 11 ? (setVm(0), setVy(vy+1)) : setVm(vm+1);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`e${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toKey(vy, vm, d);
    const date = new Date(vy, vm, d);
    const isPast = date < today;
    const isBlocked = blockedDates.includes(key);
    const isCIn = checkIn === key, isCOut = checkOut === key;
    const inRange = checkIn && checkOut && key > checkIn && key < checkOut;
    const isStart = checkIn && !checkOut && key > checkIn;

    let bg = P.bg, color = P.text, fw = 400, cursor = "pointer";
    if (isPast || isBlocked) { bg = "transparent"; color = P.textLight; cursor = "default"; if (isBlocked) { bg = P.redBg; color = P.red; } }
    else if (isCIn || isCOut) { bg = P.accent; color = "#FFF"; fw = 700; }
    else if (inRange) { bg = P.inRange; color = P.accent; }
    else if (isStart) { bg = P.accentBg; color = P.accentLight; }

    days.push(
      <button key={d} disabled={isPast || isBlocked} onClick={() => onDateClick(key)} style={{
        aspectRatio: "1", borderRadius: isCIn ? "8px 0 0 8px" : isCOut ? "0 8px 8px 0" : 8,
        border: "none", cursor, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
        background: bg, color, fontWeight: fw, transition: "all 0.15s", fontFamily: "inherit",
      }}>{d}</button>
    );
  }

  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button style={{ ...SS.counterBtn, fontSize: 20 }} onClick={prevMonth}>‹</button>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: P.text, fontWeight: 500 }}>
          {MONTHS[vm]} {vy}
        </span>
        <button style={{ ...SS.counterBtn, fontSize: 20 }} onClick={nextMonth}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: P.textLight, paddingBottom: 10, fontWeight: 600 }}>{d}</div>)}
        {days}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {[["#D9F0D9","#2E6B2E","Available"],["#FDECEA","#9B3535","Fully booked"]].map(([bg,c,l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${c}` }} />
            <span style={{ fontSize: 11, color: P.textLight }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Room Card ─────────────────────────────────────────────────────────
const RoomCard = ({ room, selected, available, onSelect }) => {
  const typeLabel = { camping: "Camping", house: "House", villa: "Villa", bungalow: "Bungalow" };
  return (
    <div onClick={() => available && onSelect(room.id)} style={{
      ...SS.card, cursor: available ? "pointer" : "not-allowed", opacity: available ? 1 : 0.55,
      border: selected ? `2px solid ${P.accent}` : `1px solid ${P.border}`,
      display: "grid", gridTemplateColumns: "160px 1fr", gap: 0,
    }}>
      <div style={{ position: "relative" }}>
        <img src={room.img} alt={room.nameEN} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 140 }} />
        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.55)", color: "#FFF", fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
          {typeLabel[room.type] || room.type}
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: P.text }}>{room.nameEN}</div>
            <div style={{ fontSize: 12, color: P.textMid }}>{room.nameTH}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: P.accent }}>{formatTHB(room.price)}</div>
            <div style={{ fontSize: 11, color: P.textLight }}>/ night</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: P.textMid, marginBottom: 10, lineHeight: 1.5 }}>{room.desc}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[`👥 Max ${room.capacity}`, `🛏 ${room.rooms} room${room.rooms>1?"s":""}`, room.petAllowed ? `🐾 Pets OK` : null].filter(Boolean).map(t => (
            <span key={t} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: P.surfaceAlt, color: P.textMid, fontWeight: 500 }}>{t}</span>
          ))}
          {room.petAllowed && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: P.sageBg, color: P.sage, fontWeight: 500 }}>+{formatTHB(room.petPrice)}/pet</span>}
        </div>
        {!available && <span style={{ fontSize: 12, color: P.red, fontWeight: 600 }}>Not available for selected dates</span>}
        {selected && <span style={{ fontSize: 12, color: "#FFF", background: P.accent, padding: "4px 14px", borderRadius: 20, fontWeight: 600 }}>✓ Selected</span>}
      </div>
    </div>
  );
};

// ── Counter ───────────────────────────────────────────────────────────
const Counter = ({ label, sub, value, min, max, onChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${P.border}` }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: P.text }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: P.textLight }}>{sub}</div>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button style={{ ...SS.counterBtn, opacity: value <= min ? 0.4 : 1 }} onClick={() => value > min && onChange(value-1)}>−</button>
      <span style={{ fontSize: 17, fontWeight: 600, minWidth: 20, textAlign: "center", color: P.text }}>{value}</span>
      <button style={{ ...SS.counterBtn, opacity: value >= max ? 0.4 : 1 }} onClick={() => value < max && onChange(value+1)}>+</button>
    </div>
  </div>
);

// ── Summary Sidebar ───────────────────────────────────────────────────
const SummarySidebar = ({ room, checkIn, checkOut, adults, childrenFree, childrenAddOn, petFree, petAddOn, canConfirm, onConfirm }) => {
  const nights = nightsBetween(checkIn, checkOut);
  if (!room) return null;
  const roomCost = nights * room.price;
  const childCost = childrenAddOn * room.priceChildren * nights;
  const petCost = room.petAllowed ? petAddOn * room.petPrice * nights : 0;
  const total = roomCost + childCost + petCost;

  return (
    <div style={{ ...SS.card, padding: 24, position: "sticky", top: 20 }}>
      <h3 style={{ ...SS.sectionTitle, marginBottom: 16 }}>Booking Summary</h3>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <img src={room.img} style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} alt={room.nameEN} />
        <div>
          <div style={{ fontWeight: 600, color: P.text, fontSize: 15 }}>{room.nameEN}</div>
          <div style={{ fontSize: 12, color: P.textMid }}>{room.nameTH}</div>
          <div style={{ fontSize: 12, color: P.textLight, marginTop: 4 }}>{room.id} · {room.rooms} room{room.rooms>1?"s":""}</div>
        </div>
      </div>
      <div style={{ background: P.surfaceAlt, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><div style={{ fontSize: 11, color: P.textLight, marginBottom: 3 }}>CHECK-IN</div><div style={{ fontSize: 13, fontWeight: 600, color: P.text }}>{formatDate(checkIn)}</div></div>
          <div><div style={{ fontSize: 11, color: P.textLight, marginBottom: 3 }}>CHECK-OUT</div><div style={{ fontSize: 13, fontWeight: 600, color: P.text }}>{formatDate(checkOut)}</div></div>
        </div>
        <div style={{ marginTop: 10, borderTop: `1px solid ${P.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 12, color: P.textMid }}>{nights} night{nights!==1?"s":""} · {adults} adult{adults>1?"s":""}{childrenFree+childrenAddOn>0?` · ${childrenFree+childrenAddOn} child${childrenFree+childrenAddOn>1?"ren":""}`:""}{petFree+petAddOn>0?` · ${petFree+petAddOn} pet${petFree+petAddOn>1?"s":""}`:""}</div>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        {[
          [`Room × ${nights} night${nights!==1?"s":""}`, roomCost],
          childrenAddOn > 0 && [`Extra bedding (${childrenAddOn} child${childrenAddOn>1?"ren":""}) × ${nights}n`, childCost],
          petAddOn > 0 && room.petAllowed && [`Pet fee (${petAddOn}) × ${nights}n`, petCost],
        ].filter(Boolean).map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: P.textMid, marginBottom: 6 }}>
            <span>{label}</span><span>{formatTHB(val)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: P.text }}>Total</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: P.accent }}>{formatTHB(total)}</span>
        </div>
      </div>

      {/* ── Bank Transfer / QR Code ── */}
      <div style={{ background: P.accentBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${P.border}` }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: P.accent, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          💳 Bank Transfer
        </h4>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <img
            src="/assets/image/Logo-Bank/Bank.jpg"
            alt="Bank QR"
            style={{ width: 110, height: 110, borderRadius: 10, objectFit: "cover", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          />
          <div style={{ fontSize: 12, lineHeight: 1.7, color: P.textMid }}>
            <div style={{ fontWeight: 600, color: P.text, fontSize: 13 }}>ธนาคารกสิกรไทย</div>
            <div>Kasikorn Bank</div>
            <div style={{ fontWeight: 600, color: P.accent, fontSize: 15, marginTop: 4 }}>
              123-4-56789-0
            </div>
            <div style={{ fontSize: 11, marginTop: 2 }}>
              <span style={{ color: P.text }}>ชื่อบัญชี / Account:</span> Hey Now Chiang Dao
            </div>
          </div>
        </div>
        <p style={{ fontSize: 10, color: P.textLight, marginTop: 10, textAlign: "center", borderTop: `1px solid ${P.border}`, paddingTop: 10 }}>
          สแกน QR Code เพื่อชำระเงิน · Scan to pay
        </p>
      </div>

      <button onClick={onConfirm} disabled={!canConfirm} style={{ ...SS.btnPrimary, opacity: canConfirm ? 1 : 0.45 }}>
        Confirm Reservation
      </button>
      <p style={{ fontSize: 11, color: P.textLight, textAlign: "center", marginTop: 10 }}>Free cancellation up to 7 days before check-in</p>
    </div>
  );
};

// ── Upload Slip ───────────────────────────────────────────────────────
const SlipUpload = ({ file, onChange }) => {
  const ref = useRef();
  return (
    <div>
      <label style={SS.label}>Payment Slip (optional)</label>
      <div onClick={() => ref.current.click()} style={{
        border: `2px dashed ${P.borderStrong}`, borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer",
        background: file ? P.sageBg : P.surfaceAlt, color: file ? P.sage : P.textLight, fontSize: 13,
      }}>
        {file ? `✓ ${file.name}` : "Click to upload transfer slip (JPG, PNG, PDF)"}
        <input ref={ref} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => onChange(e.target.files[0])} />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────
export default function BookingRoom() {
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [adults, setAdults] = useState(1);
  const [childrenFree, setChildrenFree] = useState(0);
  const [childrenAddOn, setChildrenAddOn] = useState(0);
  const [petFree, setPetFree] = useState(0);
  const [petAddOn, setPetAddOn] = useState(0);
  const [kidAges, setKidAges] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [detail, setDetail] = useState("");
  const [slip, setSlip] = useState(null);
  const [confirmId] = useState(genId());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet"; document.head.appendChild(link);
  }, []);

  const room = ROOMS.find(r => r.id === selectedRoomId);
  const nights = nightsBetween(checkIn, checkOut);
  const totalKids = childrenFree + childrenAddOn;
  const totalPets = petFree + petAddOn;

  const isRoomAvailable = (r, s, e) => {
    if (!s || !e) return true;
    const start = parseDate(s); const end = parseDate(e);
    let cur = new Date(start);
    while (cur < end) {
      const k = toKey(cur.getFullYear(), cur.getMonth(), cur.getDate());
      if (r.bookedDates.includes(k)) return false;
      cur.setDate(cur.getDate()+1);
    }
    return true;
  };

  const availableRooms = useMemo(() =>
    ROOMS.filter(r => isRoomAvailable(r, checkIn, checkOut)), [checkIn, checkOut]);

  const allBlockedDates = useMemo(() => {
    const all = ROOMS.flatMap(r => r.bookedDates);
    return [...new Set(all.filter(d => ROOMS.every(r => r.bookedDates.includes(d))))];
  }, []);

  const handleDateClick = (key) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (parseDate(key) < today) return;
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(key); setCheckOut(null); setSelectedRoomId(null); }
    else { if (key <= checkIn) { setCheckIn(key); setCheckOut(null); } else { setCheckOut(key); } }
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => { if (validate()) setStep(5); };

  const reset = () => {
    setStep(1); setCheckIn(null); setCheckOut(null); setSelectedRoomId(null);
    setAdults(1); setChildrenFree(0); setChildrenAddOn(0); setPetFree(0); setPetAddOn(0);
    setKidAges([]); setName(""); setEmail(""); setPhone(""); setDetail(""); setSlip(null); setErrors({});
  };

  const roomCost = room ? nights * room.price : 0;
  const childCost = room ? childrenAddOn * room.priceChildren * nights : 0;
  const petCost = room?.petAllowed ? petAddOn * (room.petPrice||0) * nights : 0;
  const totalPrice = roomCost + childCost + petCost;

  // ── Confirmation Screen ───────────────────────────────────────────
  if (step === 5) {
    return (
      <div style={{ background: P.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ ...SS.card, maxWidth: 520, width: "100%", padding: 40, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: P.sageBg, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✓</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: P.text, marginBottom: 8 }}>Reservation Confirmed</h1>
          <p style={{ color: P.textMid, marginBottom: 24 }}>Thank you, <strong>{name}</strong>. We've received your booking and will send confirmation to <strong>{email}</strong>.</p>

          <div style={{ background: P.surfaceAlt, borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <img src={room?.img} style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover" }} alt="" />
              <div>
                <div style={{ fontWeight: 600, color: P.text }}>{room?.nameEN}</div>
                <div style={{ fontSize: 12, color: P.textMid }}>{room?.nameTH}</div>
                <div style={{ fontSize: 13, color: P.textMid, marginTop: 4 }}>{formatDate(checkIn)} → {formatDate(checkOut)}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 12, display: "grid", gap: 6 }}>
              {[
                ["Booking ID", confirmId],
                ["Room ID", room?.id],
                ["Guests", `${adults} adult${adults>1?"s":""}${totalKids>0?` · ${totalKids} children`:""}`],
                [slip ? "Slip" : null, slip ? slip.name : null],
              ].filter(([k]) => k).map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: P.textLight }}>{k}</span>
                  <span style={{ fontWeight: 500, color: P.text }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontWeight: 700, color: P.text }}>Total Charged</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: P.accent }}>{formatTHB(totalPrice)}</span>
              </div>
            </div>
          </div>
          <button style={SS.btnPrimary} onClick={reset}>Book Another Stay</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: P.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: P.text }}>
      {/* Progress */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 0" }}>
        <StepPill current={step} />
      </div>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── STEP 1: Dates ── */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
            <div style={SS.card}><Calendar checkIn={checkIn} checkOut={checkOut} onDateClick={handleDateClick} blockedDates={allBlockedDates} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ ...SS.card, padding: 20 }}>
                <h3 style={{ ...SS.sectionTitle, fontSize: 18 }}>Your Stay</h3>
                {[["CHECK-IN", checkIn], ["CHECK-OUT", checkOut]].map(([l, val]) => (
                  <div key={l} style={{ padding: "12px 14px", borderRadius: 10, background: val ? P.accentBg : P.surfaceAlt, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: P.textLight, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: val ? 600 : 400, color: val ? P.accent : P.textLight }}>{val ? formatDate(val) : "Select on calendar"}</div>
                  </div>
                ))}
                {checkIn && checkOut && (
                  <div style={{ textAlign: "center", padding: "10px", borderRadius: 8, background: P.sageBg, color: P.sage, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                    {nights} nights · {availableRooms.length} rooms available
                  </div>
                )}
              </div>
              <button style={{ ...SS.btnPrimary, opacity: checkIn && checkOut ? 1 : 0.45 }} disabled={!checkIn || !checkOut} onClick={() => setStep(2)}>
                Browse Rooms →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Room ── */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setStep(1)} style={SS.btnGhost}>← Back to Dates</button>
              <span style={{ fontSize: 13, color: P.textMid }}>{availableRooms.length} of {ROOMS.length} rooms available for {nights} nights</span>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {ROOMS.map(r => (
                <RoomCard key={r.id} room={r} selected={selectedRoomId === r.id} available={availableRooms.some(a => a.id === r.id)} onSelect={(id) => { setSelectedRoomId(id); setAdults(1); setChildrenFree(0); setChildrenAddOn(0); setPetFree(0); setPetAddOn(0); setKidAges([]); }} />
              ))}
            </div>
            {selectedRoomId && (
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button style={{ ...SS.btnPrimary, width: "auto", padding: "13px 36px" }} onClick={() => setStep(3)}>
                  Continue with {room?.nameEN} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Guests ── */}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <button onClick={() => setStep(2)} style={{ ...SS.btnGhost, width: "fit-content" }}>← Back to Rooms</button>

              {/* Guest Counts */}
              <div style={{ ...SS.card, padding: 24 }}>
                <h3 style={{ ...SS.sectionTitle }}>Guests</h3>
                <Counter label="Adults" sub="Age 12+" value={adults} min={1} max={room?.capacity||4} onChange={setAdults} />
                <Counter label="Children (free)" sub="Under 5 · No extra bedding" value={childrenFree} min={0} max={4} onChange={setChildrenFree} />
                <Counter
                  label="Children (add-on)" sub={`Age 5–11 · +${formatTHB(room?.priceChildren||300)}/night each`}
                  value={childrenAddOn} min={0} max={Math.max(0,(room?.capacity||4) - adults)} onChange={(v) => { setChildrenAddOn(v); setKidAges(arr => { const a = [...arr]; while(a.length<v) a.push(""); return a.slice(0,v); }); }}
                />
                {childrenAddOn > 0 && (
                  <div style={{ paddingTop: 12, paddingBottom: 4 }}>
                    <label style={SS.label}>Children's ages</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {kidAges.map((age, i) => (
                        <select key={i} value={age} onChange={e => { const a=[...kidAges]; a[i]=e.target.value; setKidAges(a); }} style={{ ...SS.input, width: 90 }}>
                          <option value="">Age</option>
                          {[5,6,7,8,9,10,11].map(x => <option key={x} value={x}>{x} yrs</option>)}
                        </select>
                      ))}
                    </div>
                  </div>
                )}
                {room?.petAllowed && <>
                  <Counter label="Pets (free — registered)" sub="Already in resort system" value={petFree} min={0} max={2} onChange={setPetFree} />
                  <Counter label="Pets (add-on)" sub={`+${formatTHB(room?.petPrice||300)}/night each`} value={petAddOn} min={0} max={2} onChange={setPetAddOn} />
                </>}
              </div>

              {/* Guest Details */}
              <div style={{ ...SS.card, padding: 24 }}>
                <h3 style={{ ...SS.sectionTitle }}>Guest Details</h3>
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label style={SS.label}>Full Name *</label>
                    <input style={{ ...SS.input, borderColor: errors.name ? P.red : P.border }} placeholder="e.g. Somchai Jaidee" value={name} onChange={e => { setName(e.target.value); setErrors(er => ({...er,name:undefined})); }} />
                    {errors.name && <p style={{ fontSize: 12, color: P.red, marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={SS.label}>Email *</label>
                      <input type="email" style={{ ...SS.input, borderColor: errors.email ? P.red : P.border }} placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(er => ({...er,email:undefined})); }} />
                      {errors.email && <p style={{ fontSize: 12, color: P.red, marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={SS.label}>Phone *</label>
                      <input type="tel" style={{ ...SS.input, borderColor: errors.phone ? P.red : P.border }} placeholder="08x-xxx-xxxx" value={phone} onChange={e => { setPhone(e.target.value); setErrors(er => ({...er,phone:undefined})); }} />
                      {errors.phone && <p style={{ fontSize: 12, color: P.red, marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={SS.label}>Special Requests</label>
                    <textarea style={{ ...SS.input, height: 80, resize: "vertical" }} placeholder="Dietary needs, room preferences, arrival time..." value={detail} onChange={e => setDetail(e.target.value)} />
                  </div>
                  <SlipUpload file={slip} onChange={setSlip} />
                </div>
              </div>
            </div>
            <SummarySidebar
              room={room} checkIn={checkIn} checkOut={checkOut}
              adults={adults} childrenFree={childrenFree} childrenAddOn={childrenAddOn}
              petFree={petFree} petAddOn={petAddOn}
              canConfirm={name && email && phone}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </main>
    </div>
  );
}