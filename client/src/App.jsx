import { useEffect, useState } from "react";
import { request } from "./api";
import RoleSelect from "./components/RoleSelect";
import Inventory from "./components/Inventory";
import AddPartForm from "./components/AddPartForm";
import IssueForm from "./components/IssueForm";
import IssuesTable from "./components/IssuesTable";

// The sidebar buttons for each role
const menus = {
  admin: [
    { id: "inventory", label: "Inventory" },
    { id: "addPart", label: "Add part" },
    { id: "issues", label: "Who has what" },
  ],
  user: [
    { id: "inventory", label: "Inventory" },
    { id: "issue", label: "Issue" },
    { id: "issues", label: "Who has what" },
  ],
};

function App() {
  const [role, setRole] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [parts, setParts] = useState([]);
  const [kits, setKits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [tab, setTab] = useState("inventory");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [p, k, i] = await Promise.all([
        request("/api/parts"),
        request("/api/kits"),
        request("/api/issues"),
      ]);
      setParts(p);
      setKits(k);
      setIssues(i);
    } catch {
      setMessage({
        type: "error",
        text: "Could not reach the server. It may be waking up, so try again in a minute.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function showMessage(type, text) {
    setMessage({ type, text });
  }

  function openTab(name) {
    setTab(name);
    setMessage(null);
  }

  function handleChoose(chosenRole, password) {
    setRole(chosenRole);
    setAdminPassword(password);
    setTab("inventory");
    setMessage(null);
  }

  function handleSwitchRole() {
    setRole(null);
    setAdminPassword("");
    setMessage(null);
  }

  // First screen: choose User or Admin
  if (role === null) {
    return <RoleSelect onChoose={handleChoose} />;
  }

  const categories = [...new Set(parts.map((p) => p.category))];
  const overdueCount = issues.filter((i) => i.overdue).length;

  return (
    <div className="container">
      <header>
        <h1>PartsPal</h1>
        <p className="muted">Robotics club lab inventory and lending</p>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <p className="role-label">
            Logged in as {role === "admin" ? "Admin" : "User"}
          </p>

          {menus[role].map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "tab active" : "tab"}
              onClick={() => openTab(item.id)}
            >
              {item.label}
              {item.id === "issues" && overdueCount > 0 && (
                <span className="dot">{overdueCount}</span>
              )}
            </button>
          ))}

          <button className="switch" onClick={handleSwitchRole}>
            Switch role
          </button>
        </nav>

        <main className="content">
          {message && (
            <div
              className={message.type === "error" ? "alert error" : "alert success"}
            >
              {message.text}
            </div>
          )}

          {loading && (
            <p className="muted">
              Loading... the server can take up to a minute to wake up.
            </p>
          )}

          {tab === "inventory" && <Inventory parts={parts} />}

          {tab === "addPart" && (
            <AddPartForm
              categories={categories}
              adminPassword={adminPassword}
              onChanged={loadData}
              showMessage={showMessage}
            />
          )}

          {tab === "issue" && (
            <IssueForm
              parts={parts}
              kits={kits}
              onChanged={loadData}
              showMessage={showMessage}
            />
          )}

          {tab === "issues" && (
            <IssuesTable
              issues={issues}
              onChanged={loadData}
              showMessage={showMessage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;