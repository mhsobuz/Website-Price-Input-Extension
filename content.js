setTimeout(() => {

  if (document.body.innerText.includes("Verifying you are human")) {
    chrome.storage.local.set({ paused: true });
    alert("CAPTCHA detected. Solve it and click Start again.");
    return;
  }

  const price =
    document.querySelector(".cat-price")?.innerText || "N/A";

  const sku = location.pathname.replace("/", "");

  chrome.storage.local.get(["results", "index"], data => {
    data.results.push({ sku, price });

    chrome.storage.local.set({
      results: data.results,
      index: data.index + 1
    }, () => {
      chrome.runtime.sendMessage({ action: "NEXT" });
    });
  });

}, 5000); // wait for JS + price load
