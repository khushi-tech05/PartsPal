const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const parts = [
  { id: 1, name: "Arduino Uno", category: "Microcontroller", total: 10, available: 9 },
  { id: 2, name: "IR Sensor", category: "Sensor", total: 20, available: 20 },
  { id: 3, name: "L298N Motor Driver", category: "Motor Driver", total: 3, available: 3 },
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
const issues = [
  {
    id: 1,
    name: "Sample Member",
    regNo: "23BCE0001",
    dueDate: "2026-10-01",
    issuedOn: "2026-09-24",
    kitName: null,
    items: [{ partId: 1, partName: "Arduino Uno", qty: 1 }],
    status: "issued",
    returnedOn: null,
  },
];
let nextIssueId = 2;

// Today's date as YYYY-MM-DD in Indian time
function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

app.get("/api/issues", (req, res) => {
  const withFlag = issues.map((issue) => ({
    ...issue,
    overdue: issue.status === "issued" && issue.dueDate < today(),
  }));

  if (req.query.status === "overdue") {
    return res.json(withFlag.filter((i) => i.overdue));
  }
  res.json(withFlag);
});

const kits = [
  {
    id: 1,
    name: "Line Follower Kit",
    items: [
      { partId: 1, qty: 1 },
      { partId: 2, qty: 2 },
      { partId: 3, qty: 1 },
    ],
  },
  {
    id: 2,
    name: "Obstacle Avoider Kit",
    items: [
      { partId: 1, qty: 1 },
      { partId: 5, qty: 1 },
      { partId: 3, qty: 1 },
      { partId: 6, qty: 2 },
    ],
  },
  {
    id: 3,
    name: "Servo Starter Kit",
    items: [
      { partId: 4, qty: 1 },
      { partId: 7, qty: 2 },
    ],
  },
];

app.get("/api/kits", (req, res) => {
  const result = kits.map((kit) => ({
    ...kit,
    items: kit.items.map((item) => {
      const part = parts.find((p) => p.id === item.partId);
      return { ...item, partName: part.name, available: part.available };
    }),
  }));
  res.json(result);
});

app.post("/api/issues", (req, res) => {
  const name = String(req.body.name || "").trim();
  const regNo = String(req.body.regNo || "").trim().toUpperCase();
  const dueDate = String(req.body.dueDate || "");

  if (!name) {
    return res.status(400).json({ error: "Member name is required" });
  }
  if (!/^[A-Z0-9]{6,15}$/.test(regNo)) {
    return res.status(400).json({ error: "Enter a valid registration number" });
  }
  if (!dueDate || dueDate < today()) {
    return res.status(400).json({ error: "Due date must be today or later" });
  }

  // Work out what is being asked for: a whole kit, or one part
  let kit = null;
  let wanted = [];

  if (req.body.kitId) {
    kit = kits.find((k) => k.id === Number(req.body.kitId));
    if (!kit) {
      return res.status(404).json({ error: "Please select a valid kit" });
    }
    wanted = kit.items.map((i) => ({ partId: i.partId, qty: i.qty }));
  } else {
    const qty = Number(req.body.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({ error: "Quantity must be a whole number, at least 1" });
    }
    wanted = [{ partId: Number(req.body.partId), qty }];
  }

  // STEP 1: check every part first. Change nothing yet.
  const items = [];
  const problems = [];
  for (const w of wanted) {
    const part = parts.find((p) => p.id === w.partId);
    if (!part) {
      return res.status(404).json({ error: "Please select a valid part" });
    }
    if (part.available < w.qty) {
      problems.push(`${part.name} (need ${w.qty}, only ${part.available} available)`);
    }
    items.push({ partId: part.id, partName: part.name, qty: w.qty });
  }

  if (problems.length > 0) {
    return res
      .status(400)
      .json({ error: "Cannot issue. Not enough stock: " + problems.join("; ") });
  }

  // STEP 2: everything is in stock, so now reduce all the stock
  for (const item of items) {
    const part = parts.find((p) => p.id === item.partId);
    part.available -= item.qty;
  }

  const issue = {
    id: nextIssueId++,
    name,
    regNo,
    dueDate,
    issuedOn: today(),
    kitName: kit ? kit.name : null,
    items,
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
app.post("/api/parts", (req, res) => {
  const name = String(req.body.name || "").trim();
  const category = String(req.body.category || "").trim();
  const total = Number(req.body.total);

  if (!name) {
    return res.status(400).json({ error: "Part name is required" });
  }
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }
  if (!Number.isInteger(total) || total < 1) {
    return res.status(400).json({ error: "Total must be a whole number, at least 1" });
  }
  if (parts.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ error: "A part with this name already exists" });
  }

  const part = {
    id: Math.max(0, ...parts.map((p) => p.id)) + 1,
    name,
    category,
    total,
    available: total,
  };
  parts.push(part);

  res.status(201).json(part);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});