import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../variable";

// ฟังก์ชันสำหรับสร้างฟิลด์ Detail ซ้ำๆ
const renderDetailFields = (langPrefix, form, handleChange) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
      <input type="text" name={`${langPrefix}_name`} value={form[`${langPrefix}_name`] || ""} onChange={handleChange}
        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" />
    </div>
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">Detail</label>
      <textarea name={`${langPrefix}_detail`} value={form[`${langPrefix}_detail`] || ""} onChange={handleChange} rows={2}
        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white resize-none" />
    </div>
    {[1, 2, 3, 4, 5].map((num) => (
      <div key={num} className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Story Main {num}</label>
          <input type="text" name={`${langPrefix}_storyMain${num}`} value={form[`${langPrefix}_storyMain${num}`] || ""} onChange={handleChange}
            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Story Sub {num}</label>
          <input type="text" name={`${langPrefix}_storySub${num}`} value={form[`${langPrefix}_storySub${num}`] || ""} onChange={handleChange}
            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white" />
        </div>
      </div>
    ))}
  </div>
);

// ฟังก์ชันแมพข้อมูลจาก API เข้าสู่ State (แก้ปัญหาตัวพิมพ์เล็ก-ใหญ่)
const mapDetailsToForm = (prefix, data) => {
  const details = data?.details || {};
  const mapped = {
    [`${prefix}_name`]: details[`${prefix}_name`] || "",
    [`${prefix}_detail`]: details[`${prefix}_detail`] || "",
  };
  for (let i = 1; i <= 5; i++) {
    // ดึงข้อมูลจาก API โดยรองรับทั้งตัวพิมพ์ใหญ่ (Supabase UI) และตัวพิมพ์เล็ก (Postgres Default)
    const mainVal = details[`${prefix}_storyMain${i}`] ?? details[`${prefix}_storymain${i}`] ?? "";
    const subVal = details[`${prefix}_storySub${i}`] ?? details[`${prefix}_storysub${i}`] ?? "";
    
    // เก็บเข้า State ให้เป็นมาตรฐานเดียวกัน (ตัวพิมพ์ใหญ่) เพื่อให้ตรงกับช่อง Input
    mapped[`${prefix}_storyMain${i}`] = mainVal;
    mapped[`${prefix}_storySub${i}`] = subVal;
  }
  return mapped;
};

// ฟังก์ชันแมพข้อมูลจาก State ส่งกลับไป API (แปลงเป็นตัวพิมพ์เล็กให้ตรงกับ DB)
const buildDetailPayload = (prefix, idKey, form) => {
  const payload = { [idKey]: form[idKey] };
  payload[`${prefix}_name`] = form[`${prefix}_name`];
  payload[`${prefix}_detail`] = form[`${prefix}_detail`];
  for (let i = 1; i <= 5; i++) {
    // ไล่ตาม Schema ที่เป็นตัวพิมพ์เล็กทั้งหมด (storymain1, storysub1)
    payload[`${prefix}_storymain${i}`] = form[`${prefix}_storyMain${i}`];
    payload[`${prefix}_storysub${i}`] = form[`${prefix}_storySub${i}`];
  }
  return payload;
};

export default function EditRoom({ room, onClose, onSuccess }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("th");

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [thRes, enRes, cnRes] = await Promise.all([
          fetch(`${API_URL}/room/th/${room.room_id}`, { headers }),
          fetch(`${API_URL}/room/en/${room.room_id}`, { headers }),
          fetch(`${API_URL}/room/cn/${room.room_id}`, { headers }),
        ]);

        const thData = await thRes.json();
        const enData = await enRes.json();
        const cnData = await cnRes.json();

        setForm({
          room_capacity: room.room_capacity || "",
          room_price: room.room_price || "",
          room_rooms: room.room_rooms || "",
          updatedby: "system",
          room_detail_th_id: room.room_detail_th_id,
          room_detail_en_id: room.room_detail_en_id,
          room_detail_cn_id: room.room_detail_cn_id,
          ...mapDetailsToForm("room_detail_th", thData),
          ...mapDetailsToForm("room_detail_en", enData),
          ...mapDetailsToForm("room_detail_cn", cnData),
        });

      } catch (err) {
        setError("โหลดข้อมูลรายละเอียดห้องไม่สำเร็จ");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (room?.room_id) fetchAllDetails();
  }, [room]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await fetch(`${API_URL}/room/details/th/${form.room_detail_th_id}`, {
        method: "PUT", headers,
        body: JSON.stringify(buildDetailPayload("room_detail_th", "room_detail_th_id", form)),
      });

      await fetch(`${API_URL}/room/details/en/${form.room_detail_en_id}`, {
        method: "PUT", headers,
        body: JSON.stringify(buildDetailPayload("room_detail_en", "room_detail_en_id", form)),
      });

      await fetch(`${API_URL}/room/details/cn/${form.room_detail_cn_id}`, {
        method: "PUT", headers,
        body: JSON.stringify(buildDetailPayload("room_detail_cn", "room_detail_cn_id", form)),
      });

      const res = await fetch(`${API_URL}/room/${room.room_id}`, {
        method: "PUT", headers,
        body: JSON.stringify({
          room_capacity: Number(form.room_capacity),
          room_price: Number(form.room_price),
          room_rooms: Number(form.room_rooms),
          updatedby: form.updatedby,
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

  if (fetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-red-600" size={32} />
          <p className="text-sm text-slate-600 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            Edit Room: <span className="text-red-600">{room.room_id}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>
          )}

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity (คน)</label>
                <input type="number" name="room_capacity" value={form.room_capacity} onChange={handleChange} required
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price (฿)</label>
                <input type="number" name="room_price" value={form.room_price} onChange={handleChange} required
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Stock (ห้อง)</label>
                <input type="number" name="room_rooms" value={form.room_rooms} onChange={handleChange} required
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="flex bg-slate-100 border-b border-slate-200">
              {["th", "en", "cn"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === lang ? "bg-white text-red-600 border-b-2 border-red-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {lang === "th" ? "ภาษาไทย" : lang === "en" ? "English" : "中文"}
                </button>
              ))}
            </div>
            
            <div className="p-4">
              {activeTab === "th" && renderDetailFields("room_detail_th", form, handleChange)}
              {activeTab === "en" && renderDetailFields("room_detail_en", form, handleChange)}
              {activeTab === "cn" && renderDetailFields("room_detail_cn", form, handleChange)}
            </div>
          </div>

        </form>

        <div className="flex justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {loading ? "Updating All..." : "Update Room"}
          </button>
        </div>
      </div>
    </div>
  );
}