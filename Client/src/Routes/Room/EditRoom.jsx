import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../variable";

export default function EditRoom({ room, onClose, onSuccess }) {
  const [form, setForm] = useState({
    room_capacity: room.room_capacity || "",
    room_price: room.room_price || "",
    room_rooms: room.room_rooms || "",
    deleteflag: room.deleteflag || "N",
    updatedby: "system",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/room/${room.room_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          room_capacity: Number(form.room_capacity),
          room_price: Number(form.room_price),
          room_rooms: Number(form.room_rooms),
        }),
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Edit Room: <span className="text-red-600">{room.room_id}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity (คน)</label>
              <input type="number" name="room_capacity" value={form.room_capacity} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Price (฿)</label>
              <input type="number" name="room_price" value={form.room_price} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Stock (ห้อง)</label>
              <input type="number" name="room_rooms" value={form.room_rooms} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select name="deleteflag" value={form.deleteflag} onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white">
              <option value="N">Active</option>
              <option value="Y">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}