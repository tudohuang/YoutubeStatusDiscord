chrome.storage.local.get("latestRPC", (result) => {
    const data = result.latestRPC;

    if (!data || !data.title) {
      document.getElementById("content").style.display = "none";
      document.getElementById("empty").style.display = "block";
      return;
    }
    function upscaleArtwork(url) {
        if (url.includes("googleusercontent.com")) {
          return url.replace(/=w\d+-h\d+.*$/, "=w600-h600");
        }
        return url; 
      }
      
    document.getElementById("title").textContent = data.title || "未知標題";
    document.getElementById("artist").textContent = data.artist || "未知演出者";
    document.getElementById("artwork").src = upscaleArtwork(data.artwork || "");
    document.getElementById("status").innerHTML = data.paused
    ? "狀態：<i class='fa-solid fa-pause' style='color: #74C0FC;'></i> 暫停中"
    : "狀態：<i class='fa-solid fa-play' style='color: #74C0FC;'></i> 播放中";
    });




  const rpcToggle = document.getElementById("rpc-toggle");
  chrome.storage.local.get("rpcEnabled", (res) => {
    rpcToggle.checked = res.rpcEnabled !== false;
  });

  rpcToggle.addEventListener("change", () => {
    chrome.storage.local.set({ rpcEnabled: rpcToggle.checked });
  });
