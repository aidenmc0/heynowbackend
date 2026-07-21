import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../variable";

export default function CreateBooking({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    room_id: "",
    booking_name: "",
    booking_email: "",
    booking_phone: "",
    booking_detail: "",
    booking_adults: 0,
    booking_children_free: 0,
    booking_children_addon: 0,
    booking_pet_free: 0,
    booking_pet_addon: 0,
    booking_checkin: "",
    booking_checkout: "",
    booking_slip: null,
    confirm_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.room_id || !form.booking_name || !form.booking_checkin || !form.booking_checkout) {
      setError("กรุณากรอกข้อมูลที่จำเป็น (Room, Name, Check-In, Check-Out)");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `HTTP Error ${res.status}`);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">Add New Booking</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Room ID *</label>
              <input type="text" name="room_id" value={form.room_id} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Guest Name *</label>
            <input type="text" name="booking_name" value={form.booking_name} onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
              <input type="email" name="booking_email" value={form.booking_email} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone *</label>
              <input type="text" name="booking_phone" value={form.booking_phone} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Detail</label>
            <textarea name="booking_detail" value={form.booking_detail} onChange={handleChange} rows={3}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Check-In *</label>
              <input type="date" name="booking_checkin" value={form.booking_checkin} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Check-Out *</label>
              <input type="date" name="booking_checkout" value={form.booking_checkout} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Adults</label>
              <input type="number" name="booking_adults" value={form.booking_adults} onChange={handleChange} min={0}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Children (Free)</label>
              <input type="number" name="booking_children_free" value={form.booking_children_free} onChange={handleChange} min={0}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Children (AddOn)</label>
              <input type="number" name="booking_children_addon" value={form.booking_children_addon} onChange={handleChange} min={0}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pet (Free)</label>
              <input type="number" name="booking_pet_free" value={form.booking_pet_free} onChange={handleChange} min={0}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pet (AddOn)</label>
              <input type="number" name="booking_pet_addon" value={form.booking_pet_addon} onChange={handleChange} min={0}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm ID</label>
              <input type="text" name="confirm_id" value={form.confirm_id} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Slip</label>
              <input type="text" name="booking_slip" value={form.booking_slip || ""} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" placeholder="Slip filename or URL" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? "Saving..." : "Save Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
