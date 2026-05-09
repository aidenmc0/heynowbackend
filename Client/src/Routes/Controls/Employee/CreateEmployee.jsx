import { useState } from "react";
import { Layout } from "../../../Components/Layouts/Layout";
import { API_URL } from "../../../variable";
import "../../../CSS/CreateEmployee.css";

export default function CreateEmployee() {
  const [mode, setMode] = useState("new"); // "new" หรือ "revision"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    emp_code: "",
    base_emp_code: "",
    dep_code: "",
    emp_type: "",
    emp_prefix: "",
    emp_name: "",
    emp_surname: "",
    emp_position: "",
    emp_email: "",
    emp_password: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.dep_code) {
      setError("Department is required");
      return;
    }
    if (!formData.emp_type) {
      setError("Employee Type is required");
      return;
    }
    if (!formData.emp_prefix) {
      setError("Prefix is required");
      return;
    }
    if (!formData.emp_name) {
      setError("First Name is required");
      return;
    }
    if (!formData.emp_surname) {
      setError("Last Name is required");
      return;
    }
    if (!formData.emp_position) {
      setError("Position is required");
      return;
    }
    if (!formData.emp_email) {
      setError("Email is required");
      return;
    }
    if (!formData.emp_password) {
      setError("Password is required");
      return;
    }

    if (mode === "new") {
      if (!formData.emp_code) {
        setError("Employee Code is required for new employee");
        return;
      }
    } else {
      if (!formData.base_emp_code) {
        setError("Base Employee Code is required for revision");
        return;
      }
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      formDataToSend.append("isRevision", mode === "revision" ? 1 : 0);

      if (mode === "new") {
        formDataToSend.append("emp_code", formData.emp_code+"-A");
      } else {
        formDataToSend.append("base_emp_code", formData.base_emp_code);
      }

      formDataToSend.append("dep_code", formData.dep_code);
      formDataToSend.append("emp_type", formData.emp_type);
      formDataToSend.append("emp_prefix", formData.emp_prefix);
      formDataToSend.append("emp_name", formData.emp_name);
      formDataToSend.append("emp_surname", formData.emp_surname);
      formDataToSend.append("emp_position", formData.emp_position);
      formDataToSend.append("emp_email", formData.emp_email);
      formDataToSend.append("emp_password", formData.emp_password);
      formDataToSend.append(
        "createdBy",
        localStorage.getItem("empCode") || "SYSTEM",
      );

      // image
      if (imageFile) {
        formDataToSend.append("emp_img", imageFile);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Employee/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⭐ ไม่ต้องกำหนด Content-Type เพราะ FormData จะกำหนดเอง
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setSuccess(
        `${mode === "revision" ? "Revision" : "Employee"} created successfully! (${result.emp_code})`,
      );

      // Reset form
      setFormData({
        emp_code: "",
        base_emp_code: "",
        dep_code: "",
        emp_type: "",
        emp_prefix: "",
        emp_name: "",
        emp_surname: "",
        emp_position: "",
        emp_email: "",
        emp_password: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="create-employee-container">
        <div className="create-employee-card">
          <h1>Create Employee</h1>

          {/* Mode Selection */}
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === "new" ? "active" : ""}`}
              onClick={() => handleModeChange("new")}
            >
              New Employee
            </button>
            <button
              className={`mode-btn ${mode === "revision" ? "active" : ""}`}
              onClick={() => handleModeChange("revision")}
            >
              Create Revision
            </button>
          </div>

          {/* Messages */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Code Section */}
            <div className="form-section">
              <h3>Code Information</h3>
              {mode === "new" ? (
                <div className="form-group">
                  <label htmlFor="emp_code">Employee Code *</label>
                  <input
                    type="text"
                    id="emp_code"
                    name="emp_code"
                    value={formData.emp_code}
                    onChange={handleChange}
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="base_emp_code">Base Employee Code *</label>
                  <input
                    type="text"
                    id="base_emp_code"
                    name="base_emp_code"
                    value={formData.base_emp_code}
                    onChange={handleChange}
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emp_prefix">Prefix *</label>
                  <input
                    type="text"
                    id="emp_prefix"
                    name="emp_prefix"
                    value={formData.emp_prefix}
                    onChange={handleChange}
                    placeholder="e.g., Mr, Ms"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp_name">First Name *</label>
                  <input
                    type="text"
                    id="emp_name"
                    name="emp_name"
                    value={formData.emp_name}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="emp_surname">Last Name *</label>
                <input
                  type="text"
                  id="emp_surname"
                  name="emp_surname"
                  value={formData.emp_surname}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emp_type">Employee Type *</label>
                  <select
                    id="emp_type"
                    name="emp_type"
                    value={formData.emp_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Type --</option>
                    <option value="FT">Full-time</option>
                    <option value="PT">Part-time</option>
                    <option value="CT">Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dep_code">Department *</label>
                  <input
                    type="text"
                    id="dep_code"
                    name="dep_code"
                    value={formData.dep_code}
                    onChange={handleChange}
                    placeholder="e.g., DEP001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="form-section">
              <h3>Job Information</h3>

              <div className="form-group">
                <label htmlFor="emp_position">Position *</label>
                <input
                  type="text"
                  id="emp_position"
                  name="emp_position"
                  value={formData.emp_position}
                  onChange={handleChange}
                  placeholder="e.g., POS001"
                  required
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="form-section">
              <h3>Contact Information</h3>

              <div className="form-group">
                <label htmlFor="emp_email">Email *</label>
                <input
                  type="email"
                  id="emp_email"
                  name="emp_email"
                  value={formData.emp_email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emp_img">Employee Image (Optional)</label>
                <input
                  type="file"
                  id="emp_img"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                />
                {imageFile && (
                  <p className="file-selected">✓ {imageFile.name}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="form-section">
              <h3>Security</h3>

              <div className="form-group">
                <label htmlFor="emp_password">Password *</label>
                <input
                  type="password"
                  id="emp_password"
                  name="emp_password"
                  value={formData.emp_password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
