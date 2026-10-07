import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [parts, setParts] = useState([]);
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState({
    partId: "",
    qty: 1,
    name: "",
    regNo: "",
    dueDate: "",
  });
  const [message, setMessage] = useState(null);

  function loadData() {
    fetch(`${API}/api/parts`).then((res) => res.json()).then(setParts);
    fetch(`${API}/api/issues`).then((res) => res.json()).then(setIssues);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleIssue(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error });
      return;
    }
    setMessage({ type: "success", text: "Issued successfully" });
    loadData();
  }

  async function handleReturn(id) {
    const res = await fetch(`${API}/api/issues/${id}/return`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error });
      return;
    }
    setMessage({ type: "success", text: "Returned successfully" });
    loadData();
  }

  const categories = ["All", ...new Set(parts.map((p) => p.category))];

  const visibleParts = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1>PartsPal</h1>

      <h2>Inventory</h2>
      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <table border="1" cellPadding="8" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Total</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {visibleParts.map((part) => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.category}</td>
              <td>{part.total}</td>
              <td>{part.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleParts.length === 0 && <p>No parts found.</p>}

      <h2>Issue a part</h2>
      <form
        onSubmit={handleIssue}
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
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

      {message && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      <h2>Who has what</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Member</th>
            <th>Reg No</th>
            <th>Items</th>
            <th>Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.name}</td>
              <td>{issue.regNo}</td>
              <td>
                {issue.items.map((i) => `${i.partName} x${i.qty}`).join(", ")}
              </td>
              <td>{issue.dueDate}</td>
              <td>{issue.status}</td>
              <td>
                {issue.status === "issued" && (
                  <button onClick={() => handleReturn(issue.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {issues.length === 0 && <p>Nothing issued yet.</p>}
    </div>
  );
}

export default App;