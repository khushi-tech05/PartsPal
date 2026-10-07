import { useState } from "react";
import { request } from "../api";

function IssuesTable({ issues, onChanged, showMessage }) {
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  async function handleReturn(id) {
    try {
      await request(`/api/issues/${id}/return`, { method: "PATCH" });
      showMessage("success", "Returned successfully");
      onChanged();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  const overdueCount = issues.filter((i) => i.overdue).length;
  const visibleIssues = onlyOverdue ? issues.filter((i) => i.overdue) : issues;

  return (
    <div className="card">
      <h2>
        Who has what{" "}
        {overdueCount > 0 && (
          <span className="badge badge-red">{overdueCount} overdue</span>
        )}
      </h2>

      <label className="check">
        <input
          type="checkbox"
          checked={onlyOverdue}
          onChange={(e) => setOnlyOverdue(e.target.checked)}
        />{" "}
        Show only overdue
      </label>

      <div className="table-wrap">
        <table>
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
            {visibleIssues.map((issue) => (
              <tr key={issue.id} className={issue.overdue ? "row-overdue" : ""}>
                <td>{issue.name}</td>
                <td>{issue.regNo}</td>
                <td>
                  {issue.kitName ? `${issue.kitName}: ` : ""}
                  {issue.items.map((i) => `${i.partName} x${i.qty}`).join(", ")}
                </td>
                <td>{issue.dueDate}</td>
                <td>
                  {issue.overdue ? (
                    <span className="badge badge-red">OVERDUE</span>
                  ) : (
                    issue.status
                  )}
                </td>
                <td>
                  {issue.status === "issued" && (
                    <button
                      className="small"
                      onClick={() => handleReturn(issue.id)}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleIssues.length === 0 && <p className="muted">Nothing to show.</p>}
    </div>
  );
}

export default IssuesTable;