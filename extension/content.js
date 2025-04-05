(function () {
    const sendToBackground = (data) => {
      chrome.runtime.sendMessage({ type: "UPDATE_RPC", payload: data });
    };
  
    const getRemaining = (video) => {
      if (!video || isNaN(video.duration) || isNaN(video.currentTime)) return null;
      return Math.max(video.duration - video.currentTime, 0);
    };
  
    const getVideoInfo = () => {
      const hostname = location.hostname;
      const pathname = location.pathname;
      const video = document.querySelector("video");
      const paused = video?.paused ?? false;
      let title = "", artist = "", artwork = "", remaining = null, url = "";
  
      if (hostname === "music.youtube.com") {
        const metadata = navigator.mediaSession?.metadata;
        if (!metadata) return null;
  
        title = metadata.title;
        artist = metadata.artist;
        artwork = metadata.artwork?.[0]?.src || "ytmusic";
        remaining = getRemaining(video);
        url = location.href;
      } else if (hostname === "www.youtube.com") {
        const shortsId = pathname.startsWith("/shorts/") ? pathname.split("/")[2] : null;
        const videoId = new URLSearchParams(location.search).get("v");
  
        if (shortsId) {
          title = document.title.replace(" - YouTube", "").trim();
          artist = document.querySelector("ytd-channel-name a")?.textContent?.trim() || "Shorts 頻道";
          artwork = `https://img.youtube.com/vi/${shortsId}/hqdefault.jpg`;
          remaining = getRemaining(video);
          url = `https://www.youtube.com/shorts/${shortsId}`;
        } else if (pathname === "/watch" && videoId) {
          title = document.title.replace(" - YouTube", "").trim();
          artist = document.querySelector("#owner-name a")?.textContent?.trim() || "未知頻道";
          artwork = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          remaining = getRemaining(video);
          url = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
          return null;
        }
      }
  
      if (!title || !artist || !artwork) return null;
      return { title, artist, artwork, remaining, paused, url };
    };
  
    let lastDataStr = null;
    let lastBoundVideo = null;
  
    const update = () => {
      const data = getVideoInfo();
      if (!data) return;
  
      const dataStr = JSON.stringify(data);
      if (dataStr !== lastDataStr) {
        lastDataStr = dataStr;
        sendToBackground(data);
      }
    };
  
    const bindVideoEvents = () => {
      const video = document.querySelector("video");
      if (!video || video === lastBoundVideo) return;
      lastBoundVideo = video;
  
      ["play", "pause", "seeked", "timeupdate", "loadedmetadata"].forEach(evt => {
        video.addEventListener(evt, update);
      });
    };
  
    const init = () => {
      update();
      bindVideoEvents();
  
      const observer = new MutationObserver(() => {
        bindVideoEvents();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };
  
    window.addEventListener("load", () => setTimeout(init, 1000));
  })();
  
