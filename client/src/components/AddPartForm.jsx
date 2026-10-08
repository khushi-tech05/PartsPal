import { useState } from "react";
import { request } from "../api";

function AddPartForm({ categories, adminPassword, onChanged, showMessage }) {
  const [form, setForm] = useState({ name: "", category: "", total: 1 });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const part = await request("/api/parts", {
        method: "POST",
        headers: { "x-admin-password": adminPassword },
        body: JSON.stringify(form),
      });
      showMessage("success", `Added ${part.name}`);
      setForm({ name: "", category: "", total: 1 });
      onChanged();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  return (
    <div className="card">
      <h2>Add a new part</h2>
      <form className="form-row" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Part name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          list="category-list"
          value={form.category}
          onChange={handleChange}
        />
        <datalist id="category-list">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <input
          type="number"
          name="total"
          min="1"
          value={form.total}
          onChange={handleChange}
        />
        <button type="submit">Add part</button>
      </form>
    </div>
  );
}

export default AddPartForm;