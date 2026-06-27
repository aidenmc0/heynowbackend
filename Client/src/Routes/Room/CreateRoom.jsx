import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../variable";

// ฟังก์ชันสำหรับสร้างฟิลด์ Detail ซ้ำๆ (ลดความซ้ำซ้อนของโค้ด)
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

export default function CreateRoom({ onClose, onSuccess }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("th"); // th, en, cn

  // ดึงข้อมูลล่าสุดเพื่อ Auto ID
  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/room/th?pageSize=9999`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        let nextNum = 1;
        if (Array.isArray(data) && data.length > 0) {
          // ดึงตัวเลขออกมาจาก room_id เช่น R009 -> 9
          const ids = data.map(r => parseInt(r.room_id?.replace("R", ""), 10)).filter(n => !isNaN(n));
          const maxId = Math.max(...ids);
          nextNum = maxId + 1;
        }
        
        const paddedNum = String(nextNum).padStart(3, "0");
        
        // Set initial state พร้อม ID ที่ต่อยอดอัตโนมัติ
        setForm({
          room_id: `R${paddedNum}`,
          room_capacity: "",
          room_price: "",
          room_rooms: "",
          createdby: "system",
          // ID สำหรับตาราง Detail (แยก Prefix ตามภาษาเพื่อให้ตรงกับ Schema DB)
          room_detail_th_id: `DTH${paddedNum}`,
          room_detail_en_id: `DEN${paddedNum}`,
          room_detail_cn_id: `DCN${paddedNum}`,
          // ฟิลด์ว่างๆ สำหรับกรอกข้อมูลภาษา
          th_name: "", th_detail: "", 
          en_name: "", en_detail: "", 
          cn_name: "", cn_detail: ""
        });

      } catch (err) {
        console.error("Failed to fetch latest ID", err);
        setForm({ room_id: "R001", room_detail_th_id: "DTH001", room_detail_en_id: "DEN001", room_detail_cn_id: "DCN001" });
      }
    };

    fetchLatestId();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.room_id) {
      setError("เกิดข้อผิดพลาดกับ Room ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1. บันทึก Detail TH
      await fetch(`${API_URL}/room/details/th`, {
        method: "POST", headers,
        body: JSON.stringify({
          room_detail_th_id: form.room_detail_th_id,
          room_detail_th_name: form.th_name,
          room_detail_th_detail: form.th_detail,
          room_detail_th_storymain1: form.th_storyMain1, // เปลี่ยนเป็นตัวเล็ก
          room_detail_th_storysub1: form.th_storySub1,   // เปลี่ยนเป็นตัวเล็ก
          room_detail_th_storymain2: form.th_storyMain2, // เปลี่ยนเป็นตัวเล็ก
          room_detail_th_storysub2: form.th_storySub2,   // เปลี่ยนเป็นตัวเล็ก
          room_detail_th_storymain3: form.th_storyMain3, 
          room_detail_th_storysub3: form.th_storySub3,   
          room_detail_th_storymain4: form.th_storyMain4, 
          room_detail_th_storysub4: form.th_storySub4,   
          room_detail_th_storymain5: form.th_storyMain5, 
          room_detail_th_storysub5: form.th_storySub5,   
        }),
      });

      // 2. บันทึก Detail EN (แก้เหมือนกัน ตรง storymain, storysub)
      await fetch(`${API_URL}/room/details/en`, {
        method: "POST", headers,
        body: JSON.stringify({
          room_detail_en_id: form.room_detail_en_id,
          room_detail_en_name: form.en_name,
          room_detail_en_detail: form.en_detail,
          room_detail_en_storymain1: form.en_storyMain1, // เปลี่ยนเป็นตัวเล็ก
          room_detail_en_storysub1: form.en_storySub1,   // เปลี่ยนเป็นตัวเล็ก
          room_detail_en_storymain2: form.en_storyMain2, 
          room_detail_en_storysub2: form.en_storySub2,   
          room_detail_en_storymain3: form.en_storyMain3, 
          room_detail_en_storysub3: form.en_storySub3,   
          room_detail_en_storymain4: form.en_storyMain4, 
          room_detail_en_storysub4: form.en_storySub4,   
          room_detail_en_storymain5: form.en_storyMain5, 
          room_detail_en_storysub5: form.en_storySub5,   
        }),
      });

      // 3. บันทึก Detail CN (แก้เหมือนกัน ตรง storymain, storysub)
      await fetch(`${API_URL}/room/details/cn`, {
        method: "POST", headers,
        body: JSON.stringify({
          room_detail_cn_id: form.room_detail_cn_id,
          room_detail_cn_name: form.cn_name,
          room_detail_cn_detail: form.cn_detail,
          room_detail_cn_storymain1: form.cn_storyMain1,
          room_detail_cn_storysub1: form.cn_storySub1,
          room_detail_cn_storymain2: form.cn_storyMain2, 
          room_detail_cn_storysub2: form.cn_storySub2,   
          room_detail_cn_storymain3: form.cn_storyMain3, 
          room_detail_cn_storysub3: form.cn_storySub3,   
          room_detail_cn_storymain4: form.cn_storyMain4, 
          room_detail_cn_storysub4: form.cn_storySub4,   
          room_detail_cn_storymain5: form.cn_storyMain5, 
          room_detail_cn_storysub5: form.cn_storySub5,   
        }),
      });

      // 4. บันทึกข้อมูลห้องหลัก (เชื่อม ID ทั้งหมดเข้าด้วยกัน)
      const res = await fetch(`${API_URL}/room`, {
        method: "POST", headers,
        body: JSON.stringify({
          room_id: form.room_id,
          room_capacity: Number(form.room_capacity),
          room_price: Number(form.room_price),
          room_rooms: Number(form.room_rooms),
          room_detail_th_id: form.room_detail_th_id,
          room_detail_en_id: form.room_detail_en_id,
          room_detail_cn_id: form.room_detail_cn_id,
          createdby: form.createdby,
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

  if (!form.room_id) return null; // รอดึง ID เสร็จก่อนค่อยแสดง Form

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Add New Room</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>
          )}

          {/* Main Room Info */}
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Room ID</label>
                <input type="text" name="room_id" value={form.room_id} readOnly
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm bg-slate-100 cursor-not-allowed" />
              </div>
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

          {/* Detail Tabs */}
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
                  <span className="ml-1 text-[10px] text-slate-400">({form[`room_detail_${lang}_id`]})</span>
                </button>
              ))}
            </div>
            
            <div className="p-4">
              {activeTab === "th" && renderDetailFields("th", form, handleChange)}
              {activeTab === "en" && renderDetailFields("en", form, handleChange)}
              {activeTab === "cn" && renderDetailFields("cn", form, handleChange)}
            </div>
          </div>

        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {loading ? "Saving All Data..." : "Save Room"}
          </button>
        </div>
      </div>
    </div>
  );
}