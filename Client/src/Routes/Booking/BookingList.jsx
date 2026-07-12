import { useState } from "react";
import {
  Mail, Phone, CalendarDays, FileText, Hash,
  User, Users, Dog, CreditCard, ClipboardList, Check, X,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateBooking from "./CreateBooking";
import EditBooking from "./EditBooking";
import { API_URL } from "../../variable";

function InfoRow({ icon, label, value, mono = false }) {
  if (value === null || value === undefined || value === "") return null;
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

function BookingExpandedContent(b) {
  const checkInDate = b.booking_checkin
    ? new Date(b.booking_checkin).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const checkOutDate = b.booking_checkout
    ? new Date(b.booking_checkout).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const totalGuests = (b.booking_adults || 0) + (b.booking_children_free || 0) + (b.booking_children_addon || 0);

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={22} className="text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold text-slate-900 leading-tight truncate">{b.booking_name}</h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">Room: {b.room_id}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {checkInDate} — {checkOutDate}
          </p>
        </div>
      </div>
      <SectionCard title="Guest Info">
        <InfoRow icon={<User size={14} />} label="Name" value={b.booking_name} />
        <InfoRow icon={<Mail size={14} />} label="Email" value={b.booking_email} />
        <InfoRow icon={<Phone size={14} />} label="Phone" value={b.booking_phone} />
      </SectionCard>
      <SectionCard title="Booking Details">
        <InfoRow icon={<Hash size={14} />} label="Booking ID" value={b.booking_id} mono />
        <InfoRow icon={<Hash size={14} />} label="Room ID" value={b.room_id} mono />
        <InfoRow icon={<CalendarDays size={14} />} label="Check-In" value={checkInDate} />
        <InfoRow icon={<CalendarDays size={14} />} label="Check-Out" value={checkOutDate} />
        {b.booking_detail && <InfoRow icon={<FileText size={14} />} label="Detail" value={b.booking_detail} />}
      </SectionCard>
      <SectionCard title="Guests & Pets">
        <InfoRow icon={<Users size={14} />} label="Adults" value={b.booking_adults} />
        <InfoRow icon={<Users size={14} />} label="Children (Free)" value={b.booking_children_free} />
        <InfoRow icon={<Users size={14} />} label="Children (AddOn)" value={b.booking_children_addon} />
        <InfoRow icon={<Dog size={14} />} label="Pet (Free)" value={b.booking_pet_free} />
        <InfoRow icon={<Dog size={14} />} label="Pet (AddOn)" value={b.booking_pet_addon} />
        <InfoRow icon={<Users size={14} />} label="Total Guests" value={totalGuests} />
      </SectionCard>
      <SectionCard title="Payment & Confirmation">
        {b.confirm_id && <InfoRow icon={<CreditCard size={14} />} label="Confirm ID" value={b.confirm_id} mono />}
        {b.booking_slip && <InfoRow icon={<FileText size={14} />} label="Slip" value={b.booking_slip} />}
      </SectionCard>
    </>
  );
}

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const SEARCH_FIELDS = ["booking_id", "room_id", "booking_name", "booking_email", "booking_phone", "confirm_id"];

function ConfirmButton({ booking, onRequestConfirm }) {
  if (booking.confirm_id) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
        <Check size={12} /> Confirmed
      </span>
    );
  }
  return (
    <button
      onClick={() => onRequestConfirm(booking)}
      className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold transition-colors"
    >
      Confirm
    </button>
  );
}

function ConfirmDialog({ booking, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[380px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Confirm Check-In</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to confirm check-in for this booking?
        </p>
        <div className="bg-slate-50 rounded-lg p-3 mb-5 space-y-1 text-sm">
          <div><span className="font-semibold text-slate-500">Name:</span> {booking.booking_name}</div>
          <div><span className="font-semibold text-slate-500">Room:</span> {booking.room_name_th || booking.room_id}</div>
          <div><span className="font-semibold text-slate-500">Check-in:</span> {formatDate(booking.booking_checkin)}</div>
          <div><span className="font-semibold text-slate-500">Check-out:</span> {formatDate(booking.booking_checkout)}</div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              try { await onConfirm(booking); } finally { setLoading(false); }
            }}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [confirmBooking, setConfirmBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfirm = async (booking) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/booking/${booking.booking_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ confirm_id: `CNF-${Date.now()}` }),
      });
      if (!res.ok) throw new Error("Confirm failed");
      setConfirmBooking(null);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      alert("Failed to confirm: " + e.message);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingBooking(null);
    setRefreshKey((prev) => prev + 1);
  };

  const COLUMNS = [
  {
    header: "Booking",
    cell: (b) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={15} className="text-red-600" />
        </div>
        <div>
          <div className="font-semibold text-slate-800 text-xs">{b.booking_name}</div>
          <div className="text-[11px] text-slate-500">{b.booking_id}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Room Name",
    cell: (b) => (
      <div className="text-xs leading-relaxed">
        <div className="text-slate-700">
          <span className="font-semibold text-slate-500">TH:</span> {b.room_name_th || b.room_id}
        </div>
        <div className="text-slate-700">
          <span className="font-semibold text-slate-500">EN:</span> {b.room_name_en || b.room_id}
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    cell: (b) => (
      <div className="font-medium text-slate-800 text-xs text-right">
        {b.room_price ? `${Number(b.room_price).toLocaleString()} ฿` : "—"}
      </div>
    ),
  },
  {
    header: "Contact",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (b) => (
      <div>
        <div className="text-xs text-slate-600">{b.booking_email}</div>
        <div className="text-[11px] text-slate-500">{b.booking_phone}</div>
      </div>
    ),
  },
  {
    header: "Guests",
    cell: (b) => (
      <div className="text-xs leading-relaxed">
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[10.5ch] shrink-0 text-left">Adult:</span>
          <span>{b.booking_adults || 0}</span>
        </div>
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[10.5ch] shrink-0 text-left">C (0-5):</span>
          <span>{b.booking_children_free || 0}</span>
        </div>
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[10.5ch] shrink-0 text-left">C (&gt;5):</span>
          <span>{b.booking_children_addon || 0}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Pets",
    cell: (b) => (
      <div className="text-xs leading-relaxed">
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[6.0ch] shrink-0 text-left">Free:</span>
          <span>{b.booking_pet_free || 0}</span>
        </div>
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[6.0ch] shrink-0 text-left">Add On:</span>
          <span>{b.booking_pet_addon || 0}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Check IN-Out",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (b) => (
      <div className="text-xs leading-relaxed">
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[2.5ch] shrink-0 text-left">CI:</span>
          <span>{formatDate(b.booking_checkin)}</span>
        </div>
        <div className="text-slate-700 flex gap-1">
          <span className="font-semibold text-slate-500 w-[2.5ch] shrink-0 text-left">CO:</span>
          <span>{formatDate(b.booking_checkout)}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Note",
    cell: (b) => (
      <div className="text-xs text-slate-600 max-w-[180px] truncate" title={b.booking_detail}>
        {b.booking_detail || "—"}
      </div>
    ),
  },
  {
    header: "",
    cell: (b) => <ConfirmButton booking={b} onRequestConfirm={setConfirmBooking} />,
  },
];

  const MENU_CONFIG = {
    apiPath: "/booking",
    entityKey: "booking_id",
    columns: COLUMNS,
    searchFields: SEARCH_FIELDS,
    expandedContent: BookingExpandedContent,
    title: (b) => b.booking_name,
    subtitle: (b) => `Room ${b.room_id}`,
    addButtonLabel: "+ Add Booking",
    loadingText: "Loading booking data...",
    emptyText: "No bookings found",
    onAdd: () => setIsModalOpen(true),
    onEdit: (b) => setEditingBooking(b),
    onDelete: (b) => console.log("Delete", b.booking_id),
  };

  return (
    <>
      <DataListPage key={refreshKey} config={MENU_CONFIG} />
      {isModalOpen && (
        <CreateBooking onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
      )}
      {editingBooking && (
        <EditBooking booking={editingBooking} onClose={() => setEditingBooking(null)} onSuccess={handleSuccess} />
      )}
      {confirmBooking && (
        <ConfirmDialog
          booking={confirmBooking}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmBooking(null)}
        />
      )}
    </>
  );
}
