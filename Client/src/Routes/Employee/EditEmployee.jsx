import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { API_URL } from "../../../variable";

const DEPARTMENTS = [
  { dep_code: "DEP001", dep_full: "Human Resource Department" },
  { dep_code: "DEP002", dep_full: "Information Technology Department" },
  { dep_code: "DEP003", dep_full: "Finance and Accounting Department" },
  { dep_code: "DEP004", dep_full: "Sales and Marketing Department" },
  { dep_code: "DEP005", dep_full: "Customer Support Department" },
];

export default function EditEmployee({ employee, onClose, onSuccess }) {
  // โหลดข้อมูลเดิมจาก props เข้ามาใน state ทันที
  const [form, setForm] = useState({
    emp_prefix: employee.emp_prefix || "",
    emp_name: employee.emp_name || "",
    emp_surname: employee.emp_surname || "",
    emp_position: employee.emp_position || "",
    dep_code: employee.dep_code || "",
    emp_type: employee.emp_type || "STAFF",
    emp_tel: employee.emp_tel || "",
    emp_password: "", // 👉 เว้นว่างไว้ ถ้าไม่กรอกจะไม่เปลี่ยนรหัสผ่าน
    deleteflag: employee.deleteflag || "N",
    updatedby: "system",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emp_name || !form.dep_code) {
      setError("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, แผนก)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/employee/${employee.emp_code}`, {
        method: "PUT",
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

      onSuccess(); // เรียกฟังก์ชันเมื่อสำเร็จ
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Edit Employee: <span className="text-red-600">{employee.emp_code}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Prefix</label>
              <select name="emp_prefix" value={form.emp_prefix} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white">
                <option value="">Select...</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">First Name *</label>
              <input type="text" name="emp_name" value={form.emp_name} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
            <input type="text" name="emp_surname" value={form.emp_surname} onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department *</label>
            <select name="dep_code" value={form.dep_code} onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white">
              <option value="">Select Department...</option>
              {DEPARTMENTS.map((dep) => (
                <option key={dep.dep_code} value={dep.dep_code}>
                  {dep.dep_full} ({dep.dep_code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Position</label>
              <input type="text" name="emp_position" value={form.emp_position} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tel</label>
              <input type="text" name="emp_tel" value={form.emp_tel} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select name="emp_type" value={form.emp_type} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white">
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select name="deleteflag" value={form.deleteflag} onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white">
                <option value="N">Active</option>
                <option value="Y">Inactive</option>
              </select>
            </div>
          </div>

          {/* 👉 ช่องกรอกรหัสผ่าน (แก้ไข) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
            <input 
              type="password" 
              name="emp_password" 
              value={form.emp_password} 
              onChange={handleChange} 
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" 
              placeholder="เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}