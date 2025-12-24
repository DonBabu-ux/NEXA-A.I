window.onload = () => {

  /* ===== LOGIN ===== */
  function logIn(event) {
    event.preventDefault();
    const username = document.getElementById("login-username")?.value;
    const password = document.getElementById("login-password")?.value;

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    localStorage.setItem("nexaUser", username);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  }

  /* ===== SIGN UP ===== */
  function signUp(event) {
    event.preventDefault();
    const username = document.getElementById("signup-username")?.value;
    const email = document.getElementById("signup-email")?.value;
    const password = document.getElementById("signup-password")?.value;

    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    localStorage.setItem("nexaUser", username);
    alert("Account created!");
    window.location.href = "dashboard.html";
  }

  // Expose login/signup globally for inline HTML calls
  window.logIn = logIn;
  window.signUp = signUp;

  /* ===== PASSWORD VISIBILITY ===== */
  window.togglePassword = function(id) {
    const input = document.getElementById("signup-password");
    if (input) input.type = input.type === "password" ? "text" : "password";
  };

  /* ===== PASSWORD STRENGTH CHECK ===== */
  window.checkStrength = function() {
    const password = document.getElementById("signup-password")?.value || "";
    const strengthText = document.getElementById("strengthText");
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strengthText) {
      if (strength <= 1) {
        strengthText.textContent = "Weak password";
        strengthText.style.color = "red";
      } else if (strength <= 3) {
        strengthText.textContent = "Medium strength";
        strengthText.style.color = "orange";
      } else {
        strengthText.textContent = "Strong password";
        strengthText.style.color = "#00ffcc";
      }
    }
  };

  /* ===== DASHBOARD FUNCTIONS ===== */
  const user = localStorage.getItem("nexaUser") || "Student";
  const userNameElem = document.getElementById("userName");
  if (userNameElem) userNameElem.textContent = user;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("nexaUser");
      window.location.href = "login.html";
    });
  }

  window.summarizeFile = function summarizeFile() {
    const fileInput = document.getElementById("uploadFile");
    const textarea = document.getElementById("researchInput");
    const summaryResult = document.getElementById("summaryResult");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        if (file.name.endsWith(".docx")) {
            // Extract text from Word file
            mammoth.extractRawText({ file: file })
                .then(result => {
                    const text = result.value;
                    summaryResult.textContent = createSummary(text);
                })
                .catch(err => alert("Error reading file: " + err));
        } else {
            // Read plain text file
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                summaryResult.textContent = createSummary(text);
            };
            reader.readAsText(file);
        }
    } else if (textarea.value.trim() !== "") {
        // Summarize text from textarea
        summaryResult.textContent = createSummary(textarea.value);
    } else {
        alert("Please upload a file or enter text.");
    }
}

// ===== Humanize Function =====
window.humanizeText=function humanizeText() {
    const textarea = document.getElementById("researchInput");
    const humanizedResult = document.getElementById("humanizedResult");

    let text = textarea.value.trim();
    if (!text) return alert("Please enter text to humanize.");

    // Simple humanize logic: split sentences and make it more readable
    let humanized = text
        .replace(/\s+/g, " ")           // remove extra spaces
        .replace(/([.?!])\s*/g, "$1\n") // new line per sentence
        .replace(/\b(I|i)\b/g, "I");    // capitalize standalone 'i'

    humanizedResult.textContent = humanized;
}

// ===== Helper: Create Summary =====function createSummary(text) {
    if (!text) return "No content to summarize.";
    const sentences = text.split(/[\.\!\?]\s/).filter(s => s.length > 0);
    const summary = sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? " ..." : "");
    return "Summary: " + summary;
}


  window.researchAssist = function() {
    const topic = document.getElementById("researchQuery")?.value;
    if (!topic) return alert("Please enter a research topic.");
    const resultBox = document.getElementById("researchResult");
    if (resultBox) resultBox.textContent = "Research Insights: Demo insight for '" + topic + "'";
  };

  window.showSaved = function() {
    const saved = ["Example summary 1", "Humanized text 1"];
    const resultBox = document.getElementById("savedResults");
    if (resultBox) resultBox.innerHTML = saved.map(s => `<p>${s}</p>`).join("");
  };

  /* ===== STUDY PLANNER & GAUGE ===== */
  const tbody = document.querySelector("#plannerTable tbody");
  const progressText = document.getElementById("progressText");

  const ctx = document.getElementById('studyProgress')?.getContext('2d');
  const studyChart = ctx ? new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['Completed', 'Remaining'], datasets: [{ data: [0, 100], backgroundColor: ['#00ffcc', '#555'], borderWidth: 0 }] },
    options: { circumference: 180, rotation: -90, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: true } } }
  }) : null;

  window.addTask = function() {
    if (!tbody) return;

    const task = document.getElementById("plannerTask")?.value;
    const subject = document.getElementById("plannerSubject")?.value;
    const date = document.getElementById("plannerDate")?.value;
    const status = document.getElementById("plannerStatus")?.value;

    if (!task || !subject || !date) return alert("Fill all fields!");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${task}</td>
      <td>${subject}</td>
      <td>${date}</td>
      <td>${status}</td>
      <td><button onclick="this.closest('tr').remove(); updateProgress()">Delete</button></td>
    `;
    tbody.appendChild(tr);

    // Clear inputs
    document.getElementById("plannerTask").value = "";
    document.getElementById("plannerSubject").value = "";
    document.getElementById("plannerDate").value = "";
    document.getElementById("plannerStatus").value = "Pending";

    updateProgress();
  };

  function updateProgress() {
    if (!studyChart || !tbody) return;

    const rows = tbody.querySelectorAll("tr");
    if (rows.length === 0) {
      studyChart.data.datasets[0].data = [0, 100];
      if (progressText) progressText.textContent = "0% Completed";
      studyChart.update();
      return;
    }

    let completed = 0;
    rows.forEach(row => { if (row.children[3].textContent === "Completed") completed++; });

    const percent = Math.round((completed / rows.length) * 100);
    studyChart.data.datasets[0].data = [percent, 100 - percent];
    if (progressText) progressText.textContent = percent + "% Completed";
    studyChart.update();
  }





// Online / Idle status & Last Seen
const onlineStatus = document.getElementById("onlineStatus");
const lastSeen = document.getElementById("lastSeen");
let lastActive = new Date();

document.addEventListener("mousemove", () => {
  lastActive = new Date();
  onlineStatus.textContent = "Online";
  onlineStatus.className = "online";
});

setInterval(() => {
  const diff = Math.floor((new Date() - lastActive)/1000);
  if (diff > 60) {
    onlineStatus.textContent = "Idle";
    onlineStatus.className = "offline";
  }
  lastSeen.textContent = diff < 60 ? "Just now" : diff + "s ago";
}, 5000);

// Engagement Gauges using Chart.js
function createGauge(id, value) {
  const ctx = document.getElementById(id).getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: ['#00ffcc','#555'],
        borderWidth: 0
      }]
    },
    options: {
      circumference: 180,
      rotation: -90,
      cutout: '70%',
      plugins: { legend: { display: false } }
    }
  });
}

// Initialize gauges with demo values
const dailyGauge = createGauge('dailyGauge', 40);
const weeklyGauge = createGauge('weeklyGauge', 60);
const yearlyGauge = createGauge('yearlyGauge', 75);

// Update gauges dynamically (example: based on completed tasks)
function updateGauges(daily, weekly, yearly) {
  dailyGauge.data.datasets[0].data = [daily, 100 - daily]; dailyGauge.update();
  weeklyGauge.data.datasets[0].data = [weekly, 100 - weekly]; weeklyGauge.update();
  yearlyGauge.data.datasets[0].data = [yearly, 100 - yearly]; yearlyGauge.update();
}

// Example usage:
// updateGauges(50, 70, 90);
