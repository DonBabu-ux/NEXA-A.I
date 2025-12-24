/* =========================
   AI UTILITIES
   ========================= */

function createSummary(text) {
  if (!text) return "No content to summarize.";

  const sentences = text
    .split(/[\.\!\?]\s/)
    .filter(s => s.length > 0);

  return "Summary: " + sentences.slice(0, 3).join(". ");
}

window.summarizeFile = function () {
  const fileInput = document.getElementById("uploadFile");
  const textarea = document.getElementById("researchInput");
  const result = document.getElementById("summaryResult");

  if (!result) return;

  if (fileInput?.files?.length) {
    const reader = new FileReader();
    reader.onload = e => result.textContent = createSummary(e.target.result);
    reader.readAsText(fileInput.files[0]);
  } else if (textarea?.value.trim()) {
    result.textContent = createSummary(textarea.value);
  } else {
    alert("Upload a file or enter text");
  }
};

window.humanizeText = function () {
  const textarea = document.getElementById("researchInput");
  const output = document.getElementById("humanizedResult");

  if (!textarea?.value.trim()) return alert("Enter text");

  output.textContent = textarea.value
    .replace(/\s+/g, " ")
    .replace(/([.?!])\s*/g, "$1\n")
    .replace(/\b(i)\b/g, "I");
};

window.researchAssist = function () {
  const topic = document.getElementById("researchQuery")?.value;
  const box = document.getElementById("researchResult");

  if (!topic) return alert("Enter a topic");
  box.textContent = `Research Insights: Demo insight for "${topic}"`;
};
