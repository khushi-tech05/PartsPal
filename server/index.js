const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const parts = [
  { id: 1, name: "Arduino Uno", category: "Microcontroller", total: 10, available: 10 },
  { id: 2, name: "IR Sensor", category: "Sensor", total: 20, available: 20 },
];

app.get("/", (req, res) => {
  res.send("PartsPal server is running");
});

app.get("/api/parts", (req, res) => {
  res.json(parts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});