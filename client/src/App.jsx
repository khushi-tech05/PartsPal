import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch(`${API}/api/parts`)
      .then((res) => res.json())
      .then((data) => setParts(data));
  }, []);

  const categories = ["All", ...new Set(parts.map((p) => p.category))];

  const visibleParts = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1>PartsPal</h1>

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
    </div>
  );
}

export default App;