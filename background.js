let results = [];
let index = 0;
let skus = [];

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "START") {
    chrome.storage.local.get("skus", data => {
      skus = data.skus;
      results = [];
      index = 0;
      openNext();
    });
  }

  if (msg.action === "PRICE_DONE") {
    results.push({
      sku: msg.sku,
      price: msg.price
    });

    // auto close processed tab
    if (sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }

    index++;
    openNext();
  }
});

function openNext() {
  if (index >= skus.length) {
    downloadCSV();
    return;
  }

  // Always open next tab if there is SKU left
  chrome.tabs.create({
    url: `https://starlightlighting.ca/${skus[index]}`,
    active: false
  });
}

function downloadCSV() {
  chrome.storage.local.set({ started: false });

  let csv = "sku,price\n";
  results.forEach(r => {
    csv += `${r.sku},${r.price}\n`;
  });

  const now = new Date();
  const date =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getFullYear()).slice(-2);

  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  const filename = `prices_result_${date}_${h}-${m}${ampm}.csv`;
  const dataUrl = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

  chrome.downloads.download({
    url: dataUrl,
    filename
  });
}
