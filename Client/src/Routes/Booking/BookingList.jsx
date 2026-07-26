import { useState } from "react";
import {
  Mail, Phone, CalendarDays, FileText, Hash, DoorOpen,
  User, Users, Dog, CreditCard, ClipboardList, Check, X, Image, Upload,
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

// ── Slip Image Viewer (thumbnail + lightbox) ──
function SlipThumb({ path }) {
  const [open, setOpen] = useState(false);
  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(path);
  if (!isImage) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 underline">
        <FileText size={14} /> View Slip
      </a>
    );
  }
  return (
    <>
      <img src={path} alt="Slip"
        className="mt-1 rounded-lg border border-slate-200 max-h-28 object-contain cursor-pointer hover:opacity-85 transition-opacity"
        onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900">
              <X size={16} />
            </button>
            <img src={path} alt="Slip" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
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
          <p className="text-xs text-slate-500 truncate mt-0.5">Room: {b.room_detail_th_name || "—"}</p>
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
        <InfoRow icon={<DoorOpen size={14} />} label="Room Name" value={`${b.room_detail_th_name || "—"} / ${b.room_detail_en_name || "—"}`} />
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
        {b.confirm_status && <InfoRow icon={<Check size={14} />} label="Status" value={b.confirm_status} />}
        {b.confirm_emp_code && <InfoRow icon={<User size={14} />} label="Confirmed By" value={b.confirm_emp_code} />}
        {b.confirm_createdat && <InfoRow icon={<CalendarDays size={14} />} label="Confirmed At" value={new Date(b.confirm_createdat).toLocaleString("th-TH")} />}
        {b.confirm_remark && <InfoRow icon={<FileText size={14} />} label="Remark" value={b.confirm_remark} />}
        {b.booking_slip && (
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <span className="mt-0.5 flex-shrink-0 text-slate-400"><Image size={14} /></span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Payment Slip</p>
              <SlipThumb path={b.booking_slip} />
            </div>
          </div>
        )}
        {b.confirm_slip && (
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <span className="mt-0.5 flex-shrink-0 text-slate-400"><Image size={14} /></span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Confirm Slip</p>
              <SlipThumb path={b.confirm_slip} />
            </div>
          </div>
        )}
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
      <div className="flex flex-col items-end gap-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
          <Check size={12} /> Confirmed
        </span>
        {booking.confirm_emp_code && (
          <span className="text-[10px] text-slate-400">by {booking.confirm_emp_code}</span>
        )}
      </div>
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
  const [confirmSlipFile, setConfirmSlipFile] = useState(null);
  const [confirmSlipPreview, setConfirmSlipPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert("File too large (max 10MB)");
    setConfirmSlipFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setConfirmSlipPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleConfirmClick = async () => {
    setLoading(true);
    try {
      let confirmSlipPath = null;
      if (confirmSlipFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("slip", confirmSlipFile);
        const uploadRes = await fetch("/upload/confirm-slip", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Slip upload failed");
        const uploadData = await uploadRes.json();
        confirmSlipPath = uploadData.path;
        setUploading(false);
      }
      await onConfirm(booking, confirmSlipPath);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Confirm Check-In</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to confirm check-in for this booking?
        </p>
        <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
          <div><span className="font-semibold text-slate-500">Name:</span> {booking.booking_name}</div>
          <div><span className="font-semibold text-slate-500">Room:</span> {booking.room_detail_th_name || "—"}</div>
          <div><span className="font-semibold text-slate-500">Check-in:</span> {formatDate(booking.booking_checkin)}</div>
          <div><span className="font-semibold text-slate-500">Check-out:</span> {formatDate(booking.booking_checkout)}</div>
          {booking.booking_slip && /\.(jpe?g|png|gif|webp)$/i.test(booking.booking_slip) && (
            <div>
              <span className="font-semibold text-slate-500">Slip:</span>
              <img src={booking.booking_slip} alt="Slip"
                className="mt-1.5 rounded-lg border border-slate-200 max-h-28 object-contain w-full" />
            </div>
          )}
        </div>

        {/* Confirm Slip Upload */}
        <div className="border border-dashed border-slate-300 rounded-lg p-3 mb-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">Confirm Slip (optional)</p>
          {confirmSlipPreview ? (
            <div className="relative">
              <img src={confirmSlipPreview} alt="Preview" className="max-h-24 rounded object-contain mx-auto" />
              <button
                onClick={() => { setConfirmSlipFile(null); setConfirmSlipPreview(null); }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]"
              ><X size={12} /></button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 py-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
              <Upload size={14} /> Upload receipt / confirm slip
              <input type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={loading || uploading}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold transition-colors"
          >
            {uploading ? "Uploading..." : loading ? "Confirming..." : "Confirm"}
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

  const handleConfirm = async (booking, confirmSlipPath) => {
    const token = localStorage.getItem("token");
    const employee = JSON.parse(localStorage.getItem("employee") || "{}");
    try {
      const res = await fetch(`${API_URL}/booking/${booking.booking_id}/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ emp_code: employee.emp_code, confirm_slip: confirmSlipPath }),
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
          <span className="font-semibold text-slate-500">TH:</span> {b.room_detail_th_name || "—"}
        </div>
        <div className="text-slate-700">
          <span className="font-semibold text-slate-500">EN:</span> {b.room_detail_en_name || "—"}
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    cell: (b) => (
      <div className="font-medium text-slate-800 text-xs text-right">
        {b.booking_price ? `${Number(b.booking_price).toLocaleString()} ฿` : b.room_price ? `${Number(b.room_price).toLocaleString()} ฿/night` : "—"}
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
    subtitle: (b) => `${b.room_detail_th_name || "—"} · ${b.room_detail_en_name || ""}`,
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
