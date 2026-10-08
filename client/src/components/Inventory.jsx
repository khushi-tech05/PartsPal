import { useState } from "react";

function stockBadge(part) {
  if (part.available === 0) {
    return <span className="badge badge-red">Out of stock</span>;
  }
  if (part.available <= 2) {
    return <span className="badge badge-amber">Low stock</span>;
  }
  return null;
}

function Inventory({ parts }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(parts.map((p) => p.category))];

  const visibleParts = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="card">
      <h2>Inventory</h2>
      <div className="form-row">
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
      </div>

      <div className="table-wrap">
        <table>
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
                <td>
                  {part.available} {stockBadge(part)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleParts.length === 0 && <p className="muted">No parts found.</p>}
    </div>
  );
}

export default Inventory;