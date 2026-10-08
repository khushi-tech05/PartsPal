import { useEffect, useState } from "react";
import { request } from "./api";
import Logo from "./components/Logo";
import RoleSelect from "./components/RoleSelect";
import Inventory from "./components/Inventory";
import AddPartForm from "./components/AddPartForm";
import IssueForm from "./components/IssueForm";
import IssuesTable from "./components/IssuesTable";

// The sidebar buttons for each role
const menus = {
  admin: [
    { id: "inventory", label: "Inventory", icon: "ti-box" },
    { id: "addPart", label: "Add part", icon: "ti-plus" },
    { id: "issues", label: "Who has what", icon: "ti-list-details" },
  ],
  user: [
    { id: "inventory", label: "Inventory", icon: "ti-box" },
    { id: "issue", label: "Issue", icon: "ti-package" },
    { id: "issues", label: "Who has what", icon: "ti-list-details" },
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
    <div className="app">
      <header className="topbar">
        <div className="brand-small">
          <Logo size={28} />
          <span className="mark">
            Parts<span className="accent">Pal</span>
          </span>
        </div>
        <div className="who">
          <span className={role === "admin" ? "badge violet" : "badge cyan"}>
            {role === "admin" ? "Admin" : "User"}
          </span>
          <button className="small" onClick={handleSwitchRole}>
            <i className="ti ti-switch-horizontal"></i> Switch role
          </button>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <p className="menu-label muted">Menu</p>
          {menus[role].map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "nav-btn active" : "nav-btn"}
              onClick={() => openTab(item.id)}
            >
              <i className={`ti ${item.icon}`}></i>
              {item.label}
              {item.id === "issues" && overdueCount > 0 && (
                <span className="dot">{overdueCount}</span>
              )}
            </button>
          ))}
        </nav>

        <main className="content">
          {message && (
            <div className={message.type === "error" ? "alert error" : "alert success"}>
              {message.text}
            </div>
          )}

          {loading && (
            <p className="muted">
              Loading... the server can take up to a minute to wake up.
            </p>
          )}

          {tab === "inventory" && (
            <Inventory parts={parts} overdueCount={overdueCount} />
          )}

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