/* =========================
   DASHBOARD CORE
   ========================= */

protectDashboard();

/* User display */
const userNameElem = document.getElementById("userName");
if (userNameElem) {
  userNameElem.textContent = localStorage.getItem("nexaUser") || "Student";
}

/* =========================
   ONLINE STATUS
   ========================= */

const onlineStatus = document.getElementById("onlineStatus");
const lastSeen = document.getElementById("lastSeen");
let lastActive = new Date();

if (onlineStatus && lastSeen) {
  document.addEventListener("mousemove", () => {
    lastActive = new Date();
    onlineStatus.textContent = "Online";
    onlineStatus.className = "online";
  });

  setInterval(() => {
    const diff = Math.floor((new Date() - lastActive) / 1000);
    onlineStatus.textContent = diff > 60 ? "Idle" : "Online";
    onlineStatus.className = diff > 60 ? "offline" : "online";
    lastSeen.textContent = diff < 60 ? "Just now" : diff + "s ago";
  }, 5000);
}

/* =========================
   STUDY PLANNER
   ========================= */

const tbody = document.querySelector("#plannerTable tbody");
const progressText = document.getElementById("progressText");

let studyChart = null;
const ctx = document.getElementById("studyProgress")?.getContext("2d");

if (ctx && window.Chart) {
  studyChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Remaining"],
      datasets: [{ data: [0, 100], backgroundColor: ["#00ffcc", "#555"], borderWidth: 0 }]
    },
    options: {
      circumference: 180,
      rotation: -90,
      cutout: "70%",
      plugins: { legend: { display: false } }
    }
  });
}

window.addTask = function () {
  const task = document.getElementById("plannerTask")?.value;
  const subject = document.getElementById("plannerSubject")?.value;
  const date = document.getElementById("plannerDate")?.value;
  const status = document.getElementById("plannerStatus")?.value;

  if (!task || !subject || !date) return alert("Fill all fields");

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${task}</td>
    <td>${subject}</td>
    <td>${date}</td>
    <td>${status}</td>
    <td><button onclick="this.closest('tr').remove(); updateProgress()">Delete</button></td>
  `;
  tbody.appendChild(tr);
  updateProgress();
};

function updateProgress() {
  if (!studyChart) return;

  const rows = tbody.querySelectorAll("tr");
  const completed = [...rows].filter(r => r.children[3].textContent === "Completed").length;
  const percent = rows.length ? Math.round((completed / rows.length) * 100) : 0;

  studyChart.data.datasets[0].data = [percent, 100 - percent];
  if (progressText) progressText.textContent = percent + "% Completed";
  studyChart.update();
}
