import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../variable";

export default function CreateRoom({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    room_id: "",
    room_capacity: "",
    room_price: "",
    room_rooms: "",
    room_detail_th_id: "",
    room_detail_en_id: "",
    room_detail_cn_id: "",
    deleteflag: "N",
    createdby: "system",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.room_id) {
      setError("กรุณากรอกรหัสห้องพัก (Room ID)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/room`, {
        method: "POST",
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
          <h2 className="text-lg font-semibold text-slate-800">Add New Room</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Room ID *</label>
            <input type="text" name="room_id" value={form.room_id} onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" placeholder="เช่น R010" />
          </div>

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

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-500">Detail Mapping (Optional)</p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Thai Detail ID</label>
              <input type="text" name="room_detail_th_id" value={form.room_detail_th_id} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" placeholder="เช่น DTH010" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">English Detail ID</label>
              <input type="text" name="room_detail_en_id" value={form.room_detail_en_id} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" placeholder="เช่น DEN010" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chinese Detail ID</label>
              <input type="text" name="room_detail_cn_id" value={form.room_detail_cn_id} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" placeholder="เช่น DCN010" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? "Saving..." : "Save Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}