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

  const selectedKit = kits.find((k) => k.id === Number(form.kitId));

  return (
    <div className="card">
      <h2>Issue to a member</h2>

      <div className="mode-switch">
        <label>
          <input
            type="radio"
            checked={mode === "part"}
            onChange={() => setMode("part")}
          />{" "}
          Single part
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "kit"}
            onChange={() => setMode("kit")}
          />{" "}
          Whole kit
        </label>
      </div>

      <form className="form-row" onSubmit={handleSubmit}>
        {mode === "part" ? (
          <>
            <select name="partId" value={form.partId} onChange={handleChange}>
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
            />
          </>
        ) : (
          <select name="kitId" value={form.kitId} onChange={handleChange}>
            <option value="">Select a kit</option>
            {kits.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
        )}

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
        <button type="submit">Issue</button>
      </form>

      {mode === "kit" && selectedKit && (
        <p className="muted">
          This kit contains:{" "}
          {selectedKit.items
            .map((i) => `${i.partName} x${i.qty} (${i.available} in stock)`)
            .join(", ")}
        </p>
      )}
    </div>
  );
}

export default IssueForm;