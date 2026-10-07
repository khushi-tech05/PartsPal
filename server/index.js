const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const parts = [
  { id: 1, name: "Arduino Uno", category: "Microcontroller", total: 10, available: 10 },
  { id: 2, name: "IR Sensor", category: "Sensor", total: 20, available: 20 },
  { id: 3, name: "L298N Motor Driver", category: "Motor Driver", total: 8, available: 8 },
  { id: 4, name: "ESP32", category: "Microcontroller", total: 6, available: 6 },
  { id: 5, name: "Ultrasonic Sensor", category: "Sensor", total: 12, available: 12 },
  { id: 6, name: "DC Motor", category: "Motor", total: 16, available: 16 },
  { id: 7, name: "Servo Motor", category: "Motor", total: 9, available: 9 },
];

app.get("/", (req, res) => {
  res.send("PartsPal server is running");
});

app.get("/api/parts", (req, res) => {
  res.json(parts);
});
const issues = [];
let nextIssueId = 1;

// Today's date as YYYY-MM-DD in Indian time
function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

app.get("/api/issues", (req, res) => {
  res.json(issues);
});

app.post("/api/issues", (req, res) => {
  const name = String(req.body.name || "").trim();
  const regNo = String(req.body.regNo || "").trim().toUpperCase();
  const dueDate = String(req.body.dueDate || "");
  const qty = Number(req.body.qty);

  if (!name) {
    return res.status(400).json({ error: "Member name is required" });
  }
  if (!/^[A-Z0-9]{6,15}$/.test(regNo)) {
    return res.status(400).json({ error: "Enter a valid registration number" });
  }
  if (!dueDate || dueDate < today()) {
    return res.status(400).json({ error: "Due date must be today or later" });
  }
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: "Quantity must be a whole number, at least 1" });
  }

  const part = parts.find((p) => p.id === Number(req.body.partId));
  if (!part) {
    return res.status(404).json({ error: "Please select a valid part" });
  }
  if (part.available < qty) {
    return res.status(400).json({
      error: `Only ${part.available} ${part.name} available, but you asked for ${qty}`,
    });
  }

  part.available -= qty;

  const issue = {
    id: nextIssueId++,
    name,
    regNo,
    dueDate,
    issuedOn: today(),
    items: [{ partId: part.id, partName: part.name, qty }],
    status: "issued",
    returnedOn: null,
  };
  issues.push(issue);

  res.status(201).json(issue);
});

app.patch("/api/issues/:id/return", (req, res) => {
  const issue = issues.find((i) => i.id === Number(req.params.id));
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }
  if (issue.status === "returned") {
    return res.status(400).json({ error: "This issue is already returned" });
  }

  for (const item of issue.items) {
    const part = parts.find((p) => p.id === item.partId);
    part.available += item.qty;
  }

  issue.status = "returned";
  issue.returnedOn = today();

  res.json(issue);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});