import { useEffect, useState } from "react";
import { request } from "./api";
import Inventory from "./components/Inventory";
import IssueForm from "./components/IssueForm";
import IssuesTable from "./components/IssuesTable";

function App() {
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

  const overdueCount = issues.filter((i) => i.overdue).length;

  return (
    <div className="container">
      <header>
        <h1>PartsPal</h1>
        <p className="muted">Robotics club lab inventory and lending</p>
      </header>

      <nav className="tabs">
        <button
          className={tab === "inventory" ? "tab active" : "tab"}
          onClick={() => openTab("inventory")}
        >
          Inventory
        </button>
        <button
          className={tab === "issue" ? "tab active" : "tab"}
          onClick={() => openTab("issue")}
        >
          Issue
        </button>
        <button
          className={tab === "issues" ? "tab active" : "tab"}
          onClick={() => openTab("issues")}
        >
          Who has what
          {overdueCount > 0 && <span className="dot">{overdueCount}</span>}
        </button>
      </nav>

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
        <Inventory parts={parts} onChanged={loadData} showMessage={showMessage} />
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
    </div>
  );
}

export default App;