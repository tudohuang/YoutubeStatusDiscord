(() => {
    const send = (data) => {
      try {
        chrome.runtime?.id && chrome.runtime.sendMessage({ type: "UPDATE_RPC", payload: data });
      } catch (e) {
        console.error("❌ 傳送失敗", e.message);
      }
    };
  
    const getInfo = () => {
      const host = location.hostname, path = location.pathname, video = document.querySelector("video");
      const paused = video?.paused ?? false;
      const remain = video && !isNaN(video.duration) && !isNaN(video.currentTime)
        ? Math.max(video.duration - video.currentTime, 0) : null;
      let title = "", artist = "", artwork = "", url = "";
  
      if (host === "music.youtube.com") {
        const m = navigator.mediaSession?.metadata;
        if (!m) return null;
        ({ title, artist } = m);
        artwork = m.artwork?.[0]?.src || "ytmusic";
        url = location.href;
      } else if (host === "www.youtube.com") {
        const id = new URLSearchParams(location.search).get("v");
        const sid = path.startsWith("/shorts/") ? path.split("/")[2] : null;
        title = document.title.replace(" - YouTube", "").trim();
        artist = document.querySelector(sid ? "ytd-channel-name a" : "#owner-name a")?.textContent?.trim() || "未知頻道";
        artwork = `https://img.youtube.com/vi/${sid || id}/hqdefault.jpg`;
        url = sid ? `https://www.youtube.com/shorts/${sid}` : `https://www.youtube.com/watch?v=${id}`;
      } else return null;
  
      return title && artist && artwork ? { title, artist, artwork, paused, remaining: remain, url } : null;
    };
  
    let last = null, bound = null;
    const update = () => {
      const data = getInfo(), str = JSON.stringify(data);
      if (data && str !== last) send(data), last = str;
    };
  
    const bind = () => {
      const video = document.querySelector("video");
      if (!video || video === bound) return;
      bound = video;
      ["play", "pause", "seeked", "timeupdate", "loadedmetadata"].forEach(e => video.addEventListener(e, update));
    };
  
    window.addEventListener("load", () => {
      update(); bind();
      new MutationObserver(bind).observe(document.body, { childList: true, subtree: true });
    });
  })();
  
