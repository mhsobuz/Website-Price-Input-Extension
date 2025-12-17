const fileInput = document.getElementById("csv");
const fileName = document.getElementById("fileName");

// Show selected file name when user picks a file
fileInput.addEventListener("change", () => {
  fileName.textContent = fileInput.files[0]?.name || "Choose CSV file";
});

document.getElementById("start").onclick = () => {
  const file = fileInput.files[0];
  if (!file) return alert("Upload CSV first");

  const reader = new FileReader();
  reader.onload = () => {
    const skus = reader.result
      .split("\n")
      .slice(1)            // Skip header if any
      .map(l => l.trim())
      .filter(Boolean);

    chrome.storage.local.set({
      skus,
      started: true
    }, () => {
      chrome.runtime.sendMessage({ action: "START" });
    });
  };

  reader.readAsText(file);
};
