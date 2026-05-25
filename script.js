const defaultActivities = [
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

const trackerStorageKey = "monthly-activity-tracker-v1";
const customActivitiesKey = "monthly-activity-tracker-activities-v1";
const dayCount = 31;
const hourCount = 24;

const legend = document.querySelector("#activityLegend");
const grid = document.querySelector("#trackerGrid");
const activityMenu = document.querySelector("#activityMenu");
const addActivityButton = document.querySelector("#addActivityButton");
const clearButton = document.querySelector("#clearButton");
const activityDialog = document.querySelector("#activityDialog");
const activityForm = document.querySelector("#activityForm");
const closeDialogButton = document.querySelector("#closeDialogButton");
const activityNameInput = document.querySelector("#activityNameInput");
const activityColorInput = document.querySelector("#activityColorInput");

let trackerData = loadJson(trackerStorageKey, {});
let customActivities = loadJson(customActivitiesKey, []);
let activities = mergeActivities();
let activeCell = null;

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveTrackerData() {
  localStorage.setItem(trackerStorageKey, JSON.stringify(trackerData));
}

function saveCustomActivities() {
  localStorage.setItem(customActivitiesKey, JSON.stringify(customActivities));
}

function mergeActivities() {
  const activityMap = new Map();

  [...defaultActivities, ...customActivities].forEach((activity) => {
    if (!activity.name || !activity.color) {
      return;
    }

    activityMap.set(activity.name.toLowerCase(), {
      name: activity.name,
      color: activity.color
    });
  });

  return Array.from(activityMap.values());
}

function cellKey(day, hour) {
  return `${day}-${hour}`;
}

function findActivity(activityName) {
  return activities.find((activity) => activity.name === activityName);
}

function renderLegend() {
  legend.innerHTML = "";

  activities.forEach((activity) => {
    const item = document.createElement("span");
    item.className = "legend-pill";

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.backgroundColor = activity.color;

    const label = document.createElement("span");
    label.textContent = activity.name;

    item.append(swatch, label);
    legend.append(item);
  });
}

function renderGrid() {
  grid.innerHTML = "";
  grid.append(createHeaderCell("Hour", "corner-header"));

  for (let day = 1; day <= dayCount; day += 1) {
    grid.append(createHeaderCell(day, "date-header"));
  }

  for (let hour = 0; hour < hourCount; hour += 1) {
    grid.append(createHourHeader(hour));

    for (let day = 1; day <= dayCount; day += 1) {
      grid.append(createActivityCell(day, hour));
    }
  }
}

function createHeaderCell(text, className) {
  const cell = document.createElement("div");
  cell.className = className;
  cell.textContent = text;
  return cell;
}

function createHourHeader(hour) {
  const cell = document.createElement("div");
  cell.className = "hour-header";
  cell.textContent = `${String(hour).padStart(2, "0")}:00`;
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

  if (!savedActivity || !applyActivity(button, savedActivity)) {
    clearActivity(button, day, hour);
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openActivityMenu(button, day, hour);
  });

  return button;
}

function openActivityMenu(cell, day, hour) {
  closeActivityMenu();
  activeCell = { element: cell, day, hour };
  cell.classList.add("is-menu-target");
  renderActivityMenu(day, hour);

  const rect = cell.getBoundingClientRect();
  const menuWidth = 260;
  const menuHeight = Math.min(410, 42 + activities.length * 38);
  const left = Math.min(rect.left, window.innerWidth - menuWidth - 12);
  const top = rect.bottom + menuHeight > window.innerHeight
    ? Math.max(12, rect.top - menuHeight - 8)
    : rect.bottom + 6;

  activityMenu.style.left = `${Math.max(12, left)}px`;
  activityMenu.style.top = `${top}px`;
  activityMenu.hidden = false;
}

function renderActivityMenu(day, hour) {
  activityMenu.innerHTML = "";

  activities.forEach((activity) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "menu-option";

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.backgroundColor = activity.color;

    const label = document.createElement("span");
    label.textContent = activity.name;

    option.append(swatch, label);
    option.addEventListener("click", () => setCellActivity(day, hour, activity.name));
    activityMenu.append(option);
  });

  const clearOption = document.createElement("button");
  clearOption.type = "button";
  clearOption.className = "menu-option clear-option";
  clearOption.textContent = "Clear cell";
  clearOption.addEventListener("click", () => clearCell(day, hour));
  activityMenu.append(clearOption);
}

function setCellActivity(day, hour, activityName) {
  const key = cellKey(day, hour);
  trackerData[key] = activityName;
  saveTrackerData();
  applyActivity(activeCell.element, activityName);
  closeActivityMenu();
}

function clearCell(day, hour) {
  const key = cellKey(day, hour);
  delete trackerData[key];
  saveTrackerData();
  clearActivity(activeCell.element, day, hour);
  closeActivityMenu();
}

function applyActivity(cell, activityName) {
  const activity = findActivity(activityName);

  if (!activity) {
    return false;
  }

  cell.style.backgroundColor = activity.color;
  cell.setAttribute("aria-label", `${cell.title}, ${activity.name}`);
  return true;
}

function clearActivity(cell, day, hour) {
  cell.style.backgroundColor = "";
  cell.setAttribute("aria-label", `Day ${day}, ${String(hour).padStart(2, "0")}:00, empty`);
}

function closeActivityMenu() {
  if (activeCell?.element) {
    activeCell.element.classList.remove("is-menu-target");
  }

  activityMenu.hidden = true;
  activeCell = null;
}

function openActivityDialog() {
  activityForm.reset();
  activityColorInput.value = "#38bdf8";

  if (typeof activityDialog.showModal === "function") {
    activityDialog.showModal();
  } else {
    activityDialog.setAttribute("open", "");
  }

  activityNameInput.focus();
}

function closeActivityDialog() {
  activityDialog.close();
}

function addCustomActivity(name, color) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return;
  }

  const defaultMatch = defaultActivities.some(
    (activity) => activity.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (defaultMatch) {
    window.alert("That activity already exists.");
    return;
  }

  const existingIndex = customActivities.findIndex(
    (activity) => activity.name.toLowerCase() === normalizedName.toLowerCase()
  );
  const nextActivity = { name: normalizedName, color };

  if (existingIndex >= 0) {
    customActivities[existingIndex] = nextActivity;
  } else {
    customActivities.push(nextActivity);
  }

  saveCustomActivities();
  activities = mergeActivities();
  renderLegend();
  renderGrid();
  closeActivityDialog();
}

addActivityButton.addEventListener("click", openActivityDialog);
closeDialogButton.addEventListener("click", closeActivityDialog);

activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addCustomActivity(activityNameInput.value, activityColorInput.value);
});

clearButton.addEventListener("click", () => {
  const shouldClear = window.confirm("Clear all saved activity cells for this month?");

  if (!shouldClear) {
    return;
  }

  trackerData = {};
  saveTrackerData();
  renderGrid();
  closeActivityMenu();
});

document.addEventListener("click", (event) => {
  if (!activityMenu.hidden && !activityMenu.contains(event.target)) {
    closeActivityMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeActivityMenu();
  }
});

window.addEventListener("resize", closeActivityMenu);
window.addEventListener("scroll", closeActivityMenu, true);

renderLegend();
renderGrid();
