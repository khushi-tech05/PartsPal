import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/parts`)
      .then((res) => res.json())
      .then((data) => setParts(data));
  }, []);

  return (
    <div>
      <h1>PartsPal</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Total</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.category}</td>
              <td>{part.total}</td>
              <td>{part.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;