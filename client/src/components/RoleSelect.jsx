import { useState } from "react";
import { request } from "../api";

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
      <h1>PartsPal</h1>
      <p className="muted">Robotics club lab inventory and lending</p>

      {!askPassword ? (
        <div className="role-buttons">
          <button onClick={() => onChoose("user", "")}>User</button>
          <button onClick={() => setAskPassword(true)}>Admin</button>
        </div>
      ) : (
        <form className="card" onSubmit={handleAdminLogin}>
          <h3>Admin login</h3>
          <div className="form-row">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <button type="button" onClick={() => setAskPassword(false)}>
              Back
            </button>
          </div>
          {error && <div className="alert error">{error}</div>}
        </form>
      )}
    </div>
  );
}

export default RoleSelect;