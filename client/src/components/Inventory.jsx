import { useState } from "react";

// Badge color for each category
const categoryColors = {
  Microcontroller: "violet",
  Sensor: "cyan",
  "Motor Driver": "amber",
  Motor: "green",
};

function StatCard({ icon, color, value, label }) {
  return (
    <div className="stat">
      <div className={`icon-box ${color}`}>
        <i className={`ti ${icon}`}></i>
      </div>
      <div>
        <div className="stat-number">{value}</div>
        <div className="muted">{label}</div>
      </div>
    </div>
  );
}

// Colored label: out of stock, low stock or in stock
function statusBadge(part) {
  if (part.available === 0) {
    return <span className="badge red">Out of stock</span>;
  }
  if (part.available <= 2) {
    return <span className="badge amber">Low stock</span>;
  }
  return <span className="badge green">In stock</span>;
}

// A small bar showing how much stock is left
function StockBar({ part }) {
  const percent = Math.round((part.available / part.total) * 100);

  let color = "bar-cyan";
  if (part.available === 0) color = "bar-red";
  else if (part.available <= 2) color = "bar-amber";

  return (
    <div className="stock">
      <div className="bar">
        <div className={color} style={{ width: `${percent}%` }}></div>
      </div>
      <span>
        {part.available} / {part.total}
      </span>
    </div>
  );
}

function Inventory({ parts, overdueCount }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(parts.map((p) => p.category))];

  const visibleParts = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const unitsAvailable = parts.reduce((sum, p) => sum + p.available, 0);
  const lowCount = parts.filter((p) => p.available <= 2).length;

  return (
    <div>
      <div className="stats">
        <StatCard icon="ti-cpu" color="cyan" value={parts.length} label="Part types" />
        <StatCard icon="ti-box" color="violet" value={unitsAvailable} label="Units available" />
        <StatCard icon="ti-alert-triangle" color="amber" value={lowCount} label="Low or out" />
        <StatCard icon="ti-clock" color="red" value={overdueCount} label="Overdue" />
      </div>

      <div className="card">
        <div className="form-row">
          <input
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
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
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleParts.map((part) => (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  <td>
                    <span className={`badge ${categoryColors[part.category] || "violet"}`}>
                      {part.category}
                    </span>
                  </td>
                  <td>
                    <StockBar part={part} />
                  </td>
                  <td>{statusBadge(part)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleParts.length === 0 && <p className="muted">No parts found.</p>}
      </div>
    </div>
  );
}

export default Inventory;