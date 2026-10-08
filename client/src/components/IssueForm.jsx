import { useState } from "react";
import { request } from "../api";

function IssueForm({ parts, kits, onChanged, showMessage }) {
  const [mode, setMode] = useState("part");
  const [form, setForm] = useState({
    partId: "",
    kitId: "",
    qty: 1,
    name: "",
    regNo: "",
    dueDate: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const person = {
      name: form.name,
      regNo: form.regNo,
      dueDate: form.dueDate,
    };
    const body =
      mode === "kit"
        ? { kitId: form.kitId, ...person }
        : { partId: form.partId, qty: form.qty, ...person };

    try {
      await request("/api/issues", {
        method: "POST",
        body: JSON.stringify(body),
      });
      showMessage("success", "Issued successfully");
      onChanged();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  return (
    <div className="card">
      <h2>Issue to a member</h2>

      {/* Switch between a single part and a whole kit */}
      <div className="seg-row">
        <button
          type="button"
          className={mode === "part" ? "seg active" : "seg"}
          onClick={() => setMode("part")}
        >
          Single part
        </button>
        <button
          type="button"
          className={mode === "kit" ? "seg active" : "seg"}
          onClick={() => setMode("kit")}
        >
          Whole kit
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "part" ? (
          <div className="form-row">
            <select
              name="partId"
              value={form.partId}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="">Select a part</option>
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.available} available)
                </option>
              ))}
            </select>
            <input
              type="number"
              name="qty"
              min="1"
              value={form.qty}
              onChange={handleChange}
              style={{ width: 90 }}
            />
          </div>
        ) : (
          <div>
            {/* One clickable card for each kit */}
            {kits.map((kit) => {
              const isShort = kit.items.some((i) => i.available < i.qty);
              const isSelected = Number(form.kitId) === kit.id;

              return (
                <button
                  type="button"
                  key={kit.id}
                  className={isSelected ? "kit-card selected" : "kit-card"}
                  onClick={() => setForm({ ...form, kitId: kit.id })}
                >
                  <div className="kit-title">
                    <span>{kit.name}</span>
                    {isShort && <span className="badge red">Short on stock</span>}
                  </div>
                  <div>
                    {kit.items.map((i) => (
                      <span
                        key={i.partId}
                        className={i.available < i.qty ? "mini short" : "mini"}
                      >
                        {i.partName} x{i.qty}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Member name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="regNo"
            placeholder="Registration number"
            value={form.regNo}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary">
          <i className="ti ti-check"></i> Issue
        </button>
      </form>
    </div>
  );
}

export default IssueForm;