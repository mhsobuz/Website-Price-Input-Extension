chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "START" || msg.action === "NEXT") {
    chrome.storage.local.get(["skus", "index", "paused"], data => {
      if (data.paused) return;

      if (data.index >= data.skus.length) {
        alert("All SKUs done");
        return;
      }

      const sku = data.skus[data.index];
      chrome.tabs.create({
        url: `https://starlightlighting.ca/${sku}`,
        active: false
      });
    });
  }
});
