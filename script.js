const activities = [
  { name: "Deep Work", color: "#3b82f6" },
  { name: "Video Editing", color: "#ec4899" },
  { name: "Lecturing", color: "#f97316" },
  { name: "Research", color: "#14b8a6" },
  { name: "Reading", color: "#8b5cf6" },
  { name: "Exercise", color: "#22c55e" },
  { name: "Family", color: "#facc15" },
  { name: "Social Media", color: "#06b6d4" },
  { name: "Entertainment", color: "#ef4444" },
  { name: "Travel", color: "#a3e635" },
  { name: "Meetings", color: "#94a3b8" }
];

const storageKey = "monthly-activity-tracker-v1";
const dayCount = 31;
const hourCount = 24;

const palette = document.querySelector("#activityPalette");
const grid = document.querySelector("#trackerGrid");
const selectedActivityLabel = document.querySelector("#selectedActivity");
const clearButton = document.querySelector("#clearButton");

let selectedActivity = activities[0];
let trackerData = loadTrackerData();

function loadTrackerData() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveTrackerData() {
  localStorage.setItem(storageKey, JSON.stringify(trackerData));
}

function cellKey(day, hour) {
  return `${day}-${hour}`;
}

function renderPalette() {
  palette.innerHTML = "";

  activities.forEach((activity) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "activity-button";
    button.dataset.activity = activity.name;
    button.setAttribute("aria-pressed", activity.name === selectedActivity.name);

    if (activity.name === selectedActivity.name) {
      button.classList.add("is-active");
    }

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.backgroundColor = activity.color;

    const label = document.createElement("span");
    label.textContent = activity.name;

    button.append(swatch, label);
    button.addEventListener("click", () => selectActivity(activity));
    palette.append(button);
  });
}

function selectActivity(activity) {
  selectedActivity = activity;
  selectedActivityLabel.textContent = activity.name;
  renderPalette();
}

function renderGrid() {
  grid.innerHTML = "";
  grid.append(createHeaderCell("Day / Hour", "corner-header"));

  for (let hour = 0; hour < hourCount; hour += 1) {
    grid.append(createHeaderCell(String(hour).padStart(2, "0")));
  }

  for (let day = 1; day <= dayCount; day += 1) {
    grid.append(createDayHeader(day));

    for (let hour = 0; hour < hourCount; hour += 1) {
      grid.append(createActivityCell(day, hour));
    }
  }
}

function createHeaderCell(text, extraClass = "") {
  const cell = document.createElement("div");
  cell.className = `grid-header ${extraClass}`.trim();
  cell.textContent = text;
  return cell;
}

function createDayHeader(day) {
  const cell = document.createElement("div");
  cell.className = "day-header";
  cell.textContent = `Day ${day}`;
  return cell;
}

function createActivityCell(day, hour) {
  const button = document.createElement("button");
  const key = cellKey(day, hour);
  const savedActivity = trackerData[key];

  button.type = "button";
  button.className = "grid-cell";
  button.dataset.day = day;
  button.dataset.hour = hour;
  button.title = `Day ${day}, ${String(hour).padStart(2, "0")}:00`;

  if (savedActivity) {
    applyActivity(button, savedActivity);
  }

  button.addEventListener("click", () => {
    const currentActivity = trackerData[key];

    if (currentActivity === selectedActivity.name) {
      delete trackerData[key];
      clearActivity(button, day, hour);
    } else {
      trackerData[key] = selectedActivity.name;
      applyActivity(button, selectedActivity.name);
    }

    saveTrackerData();
  });

  return button;
}

function applyActivity(cell, activityName) {
  const activity = activities.find((item) => item.name === activityName);

  if (!activity) {
    return;
  }

  cell.style.backgroundColor = activity.color;
  cell.setAttribute("aria-label", `${cell.title}, ${activity.name}`);
}

function clearActivity(cell, day, hour) {
  cell.style.backgroundColor = "";
  cell.setAttribute("aria-label", `Day ${day}, ${String(hour).padStart(2, "0")}:00, empty`);
}

clearButton.addEventListener("click", () => {
  const shouldClear = window.confirm("Clear all saved activity cells for this month?");

  if (!shouldClear) {
    return;
  }

  trackerData = {};
  saveTrackerData();
  renderGrid();
});

renderPalette();
renderGrid();
