document.getElementById("start").onclick = () => {
  const file = document.getElementById("csv").files[0];
  if (!file) return alert("Upload CSV first");

  const reader = new FileReader();
  reader.onload = () => {
    const skus = reader.result
      .split("\n")
      .slice(1)
      .map(l => l.trim())
      .filter(Boolean);

    chrome.storage.local.set({
      skus,
      index: 0,
      results: [],
      paused: false
    }, () => {
      chrome.runtime.sendMessage({ action: "START" });
    });
  };
  reader.readAsText(file);
};

document.getElementById("download").onclick = () => {
  chrome.storage.local.get("results", data => {
    let csv = "sku,price\n";
    data.results.forEach(r => {
      csv += `${r.sku},${r.price}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url,
      filename: "prices_result.csv"
    });
  });
};
