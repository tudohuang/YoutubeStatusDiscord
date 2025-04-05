chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_RPC") {
      const data = message.payload;
  
      chrome.storage.local.get("rpcEnabled", (res) => {
        if (res.rpcEnabled === false) {
          console.log("🚫 [背景頁] RPC 傳送已關閉");
          return;
        }
  
        fetch("http://127.0.0.1:3000", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
          .then(res => {
            if (!res.ok) throw new Error(`伺服器錯誤：${res.status}`);
            console.log("✅ [背景頁] 傳送成功", data);
            chrome.storage.local.set({ latestRPC: data }); // 🧠 存起來給 popup 用
          })
          .catch(err => {
            console.error("❌ [背景頁] 傳送失敗", err.message || err);
          });
      });
    }
  });
