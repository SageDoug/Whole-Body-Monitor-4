const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

const healthData = {
  steps: 10234,
  calories: 540,
  activeMinutes: 72,
  heartRate: 68,
  ecg: "Normal sinus rhythm",
  spo2: 98,
  menstrualCycle: "Day 12 – Ovulation window",
  stress: "Moderate",
  bodyComposition: "18% body fat",
  sleep: {
    deep: "1h 40m",
    light: "4h 10m",
    rem: "1h 50m"
  },
  sleepApnea: "Low risk",
  bloodPressure: "118/76",
  energyScore: 82,
  antioxidants: "Optimal",
  fallDetection: "No falls detected"
};

app.get("/api/health", (req, res) => {
  res.json(healthData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
