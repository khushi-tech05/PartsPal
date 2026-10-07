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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});