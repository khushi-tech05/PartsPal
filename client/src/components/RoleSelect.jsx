import { useState } from "react";
import { request } from "../api";
import Logo from "./Logo";
import CircuitBackground from "./CircuitBackground";

function RoleSelect({ onChoose }) {
  const [askPassword, setAskPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleAdminLogin(e) {
    e.preventDefault();
    try {
      await request("/api/login", {
        method: "POST",
        headers: { "x-admin-password": password },
      });
      onChoose("admin", password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="role-screen">
      {/* Left side: logo and robotics background */}
      <div className="brand-panel">
        <CircuitBackground />
        <div className="brand-content">
          <Logo size={56} />
          <div className="wordmark">
            Parts<span className="accent">Pal</span>
          </div>
          <p className="muted tagline">Robotics club lab inventory and lending</p>

          <div className="chip">
            <i className="ti ti-cpu text-cyan"></i> Track every part
          </div>
          <div className="chip">
            <i className="ti ti-package text-violet"></i> Issue whole kits in one go
          </div>
          <div className="chip">
            <i className="ti ti-clock text-amber"></i> Never miss a return date
          </div>
        </div>
      </div>

      {/* Right side: choose User or Admin */}
      <div className="role-panel">
        <div className="role-box">
          {!askPassword ? (
            <div>
              <h1 className="role-heading">Welcome back</h1>
              <p className="muted">Choose how you want to continue</p>

              <button className="role-card" onClick={() => onChoose("user", "")}>
                <span className="icon-box cyan">
                  <i className="ti ti-user"></i>
                </span>
                <span>
                  <span className="role-title">User</span>
                  <span className="role-desc">Issue parts and kits, see who has what</span>
                </span>
              </button>

              <button className="role-card" onClick={() => setAskPassword(true)}>
                <span className="icon-box violet">
                  <i className="ti ti-shield-lock"></i>
                </span>
                <span>
                  <span className="role-title">Admin</span>
                  <span className="role-desc">Add parts and manage the inventory</span>
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin}>
              <h1 className="role-heading">Admin login</h1>
              <p className="muted">Enter the admin password</p>

              <input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: 12 }}
              />
              {error && <div className="alert error">{error}</div>}

              <div className="form-row">
                <button type="submit" className="primary">
                  Login
                </button>
                <button type="button" onClick={() => setAskPassword(false)}>
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;