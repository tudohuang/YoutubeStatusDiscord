chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "UPDATE_RPC") return;
  
    chrome.storage.local.get("rpcEnabled", (res) => {
      if (res.rpcEnabled === false) return;
  
      fetch("http://127.0.0.1:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload)
      })
        .then(r => {
          if (!r.ok) throw new Error(`Server ${r.status}`);
          chrome.storage.local.set({ latestRPC: msg.payload });
          console.log("✅ Sent:", msg.payload.title || "(No Title)");
        })
        .catch(e => console.error("❌ RPC Failed:", e.message));
    });
  });
  
