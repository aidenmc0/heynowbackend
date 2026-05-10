import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import { API_URL } from "../variable";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ── Step 1: Login ────────────────────────────────────
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_code: username,   // ✅ แก้จาก empCode → emp_code ให้ตรงกับ backend
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 💾 Save token & employee info
      localStorage.setItem("token", data.token);
      localStorage.setItem("employee", JSON.stringify(data.employee));

      // ── Step 2: Fetch Full Profile ───────────────────────
      const profileRes = await fetch(`${API_URL}/employee/${data.employee.emp_code}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (profileRes.ok) {
        const profileJson = await profileRes.json();
        const profileData = profileJson.data || profileJson;
        localStorage.setItem("employeeProfile", JSON.stringify(profileData));
      } else {
        localStorage.setItem("employeeProfile", JSON.stringify(data.employee));
      }

      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep">
      <div className="bg-dots" />

      <div className="ec">
        <div className={`ec-bar ani${mounted ? " on" : " d1"}`} />
        <div className="ec-inner">
          <div className={`bh ani${mounted ? " on d1" : ""}`}>
            <img src="/logo.png" alt="ETRIA - Your Digital Device Partner" />
          </div>

          <div className={`bdiv ani${mounted ? " on d2" : ""}`} />

          <div className={`fh-wrap ani${mounted ? " on d2" : ""}`}>
            <h2 className="fh-title">Sign in to your workspace</h2>
            <p className="fh-sub">Use your company credentials to continue</p>
          </div>

          {error && (
            <div className="err">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form autoComplete="off" onSubmit={handleLogin}>
            <div className={`fld ani${mounted ? " on d3" : ""}${focusedField === "username" ? " foc" : ""}`}>
              <label className="fld-l" htmlFor="username">Username</label>
              <div className="fld-w">
                <input
                  type="text"
                  id="username"
                  className="fld-i"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your username"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className={`fld ani${mounted ? " on d4" : ""}${focusedField === "password" ? " foc" : ""}`}>
              <label className="fld-l" htmlFor="password">Password</label>
              <div className="fld-w">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="fld-i"
                  style={{ paddingRight: 42 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={`form-row ani${mounted ? " on d5" : ""}`}>
              <label className="chk-wrap">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="chk-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="chk-label">Remember me</span>
              </label>
              <a href="#" className="forgot">Forgot password?</a>
            </div>

            <div className={`ani${mounted ? " on d5" : ""}`}>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Authenticating
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className={`need ani${mounted ? " on d6" : ""}`}>
            Need access? <a href="#">Contact IT Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}