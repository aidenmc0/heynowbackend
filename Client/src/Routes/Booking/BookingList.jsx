import { useState, useCallback } from "react";
import {
  Mail, Phone, CalendarDays, FileText, Hash,
  User, Users, Dog, CreditCard, ClipboardList,
} from "lucide-react";
import DataListPage from "../../Components/DataTable/DetailListPage";
import CreateBooking from "./CreateBooking";
import EditBooking from "./EditBooking";

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

const SEARCH_FIELDS = ["booking_id", "room_id", "booking_name", "booking_email", "booking_phone", "confirm_id"];

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
    header: "Room",
    cell: (b) => (
      <div className="font-medium text-slate-800 text-xs">{b.room_id}</div>
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
      <div className="flex items-center gap-1">
        <Users size={13} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-700">
          {(b.booking_adults || 0) + (b.booking_children_free || 0) + (b.booking_children_addon || 0)}
        </span>
      </div>
    ),
  },
  {
    header: "Pets",
    cell: (b) => (
      <div className="flex items-center gap-1">
        <Dog size={13} className="text-slate-400" />
        <span className="text-xs text-slate-600">
          {(b.booking_pet_free || 0) + (b.booking_pet_addon || 0)}
        </span>
      </div>
    ),
  },
  {
    header: "Check-In",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (b) => (
      <div className="text-xs text-slate-600">
        {b.booking_checkin ? new Date(b.booking_checkin).toLocaleDateString("th-TH") : "—"}
      </div>
    ),
  },
  {
    header: "Check-Out",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
    cell: (b) => (
      <div className="text-xs text-slate-600">
        {b.booking_checkout ? new Date(b.booking_checkout).toLocaleDateString("th-TH") : "—"}
      </div>
    ),
  },
];

export default function BookingList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingBooking(null);
    setRefreshKey((prev) => prev + 1);
  };

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
    </>
  );
}
