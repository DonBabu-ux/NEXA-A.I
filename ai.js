// Helper: POST data to backend with error handling
async function postData(url = "", data = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return { result: `Error: ${error.message}` };
  }
}

// === Summarize ===
window.summarizeFile = async function () {
  const fileInput = document.getElementById("uploadFile");
  const summaryResult = document.getElementById("summaryResult");
  const btn = document.querySelector("button[onclick='summarizeFile()']");

  if (!fileInput.files.length) return alert("Please upload a file.");
  const text = await fileInput.files[0].text();

  btn.disabled = true;
  summaryResult.textContent = "Generating summary...";
  const data = await postData("http://localhost:3000/summarize", { text });
  summaryResult.textContent = data.result;
  btn.disabled = false;
};

// === Humanize ===
window.humanizeText = async function () {
  const textarea = document.getElementById("researchInput");
  const humanizedResult = document.getElementById("humanizedResult");
  const btn = document.querySelector("button[onclick='humanizeText()']");

  if (!textarea.value.trim()) return alert("Enter text to humanize.");

  btn.disabled = true;
  humanizedResult.textContent = "Processing text...";
  const data = await postData("http://localhost:3000/humanize", { text: textarea.value });
  humanizedResult.textContent = data.result;
  btn.disabled = false;
};

// === Research ===
window.researchAssist = async function () {
  const topic = document.getElementById("researchQuery")?.value;
  const resultBox = document.getElementById("researchResult");
  const btn = document.querySelector("button[onclick='researchAssist()']");

  if (!topic.trim()) return alert("Enter a topic.");

  btn.disabled = true;
  resultBox.textContent = "Fetching research insights...";
  const data = await postData("http://localhost:3000/research", { topic });
  resultBox.textContent = data.result;
  btn.disabled = false;
};
