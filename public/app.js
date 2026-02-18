let role = 4; // Default = athlete

const roleViews = {
  1: ["steps", "activeMinutes", "energyScore", "sleep"],
  2: ["heartRate", "calories", "bodyComposition", "stress"],
  3: ["ecg", "bloodPressure", "spo2", "sleepApnea", "fallDetection"],
  4: [
    "steps",
    "calories",
    "activeMinutes",
    "heartRate",
    "stress",
    "sleep",
    "energyScore"
  ]
};

function setRole(r) {
  role = r;
  loadData();
  highlightButton(r);
}

function highlightButton(selectedRole) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button, index) => {
    if (index + 1 === selectedRole) {
      button.style.transform = "scale(1.1)";
      button.style.boxShadow = "0 0 15px rgba(56, 189, 248, 0.5)";
    } else {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "none";
    }
  });
}

async function loadData() {
  const res = await fetch("/api/health");
  const data = await res.json();

  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "";

  roleViews[role].forEach(metric => {
    const card = document.createElement("div");
    card.className = "card";

    if (metric === "sleep") {
      renderSleepCard(card, data.sleep);
    } else {
      renderGraphCard(card, metric, data[metric]);
    }

    dashboard.appendChild(card);
  });
}

function renderSleepCard(card, sleepData) {
  card.innerHTML = `
    <h3>Sleep Stages</h3>
    <canvas id="sleepChart"></canvas>
  `;

  const ctx = document.getElementById("sleepChart").getContext("2d");
  const sleepChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Deep", "Light", "REM"],
      datasets: [{
        label: "Sleep Stages (hours)",
        data: [
          parseFloat(sleepData.deep),
          parseFloat(sleepData.light),
          parseFloat(sleepData.rem)
        ],
        backgroundColor: ["#4caf50", "#ffeb3b", "#2196f3"],
        borderColor: ["#4caf50", "#ffeb3b", "#2196f3"],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
}

function renderGraphCard(card, metric, value) {
  let chartData = [];
  let labels = [];

  switch (metric) {
    case "steps":
    case "calories":
    case "activeMinutes":
      chartData = [value, value * 1.2, value * 0.9]; // Simulated trend data for example
      labels = ["Today", "Yesterday", "Last Week"];
      break;

    case "heartRate":
      chartData = [value, value + 5, value - 3]; // Simulated trend data
      labels = ["Morning", "Afternoon", "Evening"];
      break;

    case "energyScore":
      chartData = [value, value * 1.1, value * 0.95];
      labels = ["Morning", "Afternoon", "Evening"];
      break;

    default:
      chartData = [value];
      labels = ["Current"];
      break;
  }

  card.innerHTML = `
    <h3>${formatTitle(metric)}</h3>
    <canvas id="${metric}Chart"></canvas>
  `;

  const ctx = document.getElementById(`${metric}Chart`).getContext("2d");
  new Chart(ctx, {
    type: "line", // You can change it to 'bar', 'pie', etc.
    data: {
      labels: labels,
      datasets: [{
        label: formatTitle(metric),
        data: chartData,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        fill: true,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function formatTitle(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase());
}

loadData();
