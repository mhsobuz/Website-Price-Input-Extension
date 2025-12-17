chrome.storage.local.get("started", data => {
  if (!data.started) return; // Do nothing if Start not pressed

  setTimeout(() => {
    if (document.body.innerText.includes("Verifying you are human")) {
      chrome.storage.local.set({ paused: true });
      alert("CAPTCHA detected. Solve it and press Start again.");
      return;
    }

    const rawPrice =
      document.querySelector(".cat-price")?.innerText || "N/A";
    const cleanPrice = rawPrice.replace(/,/g, "");
    const sku = location.pathname.replace("/", "");

    chrome.runtime.sendMessage({
      action: "PRICE_DONE",
      sku,
      price: cleanPrice
    });
  }, 5000);
});
