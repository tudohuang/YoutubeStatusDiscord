(function() {
    const sendRPC = (data) => {
        fetch("http://127.0.0.1:3000", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(() => console.log("✅ Transfer successful:", data))
            .catch(err => {
                console.error("❌ Transmission failed", err.message || err);
                console.warn("Data content:", data);
            });
    };

    const getRemaining = (video) => {
        if (!video || isNaN(video.duration) || isNaN(video.currentTime)) return null;
        return Math.max(video.duration - video.currentTime, 0);
    };

    const getShortsId = () => {
        const match = location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const extractData = () => {
        const hostname = location.hostname;
        const video = document.querySelector("video");
        const paused = video?.paused ?? false;
        let title = "",
            artist = "",
            artwork = "",
            remaining = null,
            url = "";

        if (hostname === "music.youtube.com") {
            const metadata = navigator.mediaSession?.metadata;
            const playbackState = navigator.mediaSession?.playbackState;
            if (!metadata) return null;

            title = metadata.title;
            artist = metadata.artist;
            artwork = metadata.artwork?.[0]?.src || "ytmusic";
            remaining = getRemaining(video);
            url = location.href;
        } else if (hostname === "www.youtube.com") {
            // Shorts
            const shortsId = getShortsId();
            if (shortsId) {
                title = document.title.replace(" - YouTube", "").trim();
                artist = document.querySelector("ytd-channel-name a")?.textContent?.trim() || "Shorts Channel";
                artwork = `https://img.youtube.com/vi/${shortsId}/hqdefault.jpg`;
                remaining = getRemaining(video);
                url = `https://www.youtube.com/shorts/${shortsId}`;
            }

            // Normal video
            else if (location.pathname === "/watch") {
                const videoId = new URLSearchParams(location.search).get("v");
                if (!videoId) return null;

                title = document.title.replace(" - YouTube", "").trim();
                artist = document.querySelector("#owner-name a")?.textContent?.trim() || "Unknown channel";
                artwork = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                remaining = getRemaining(video);
                url = `https://www.youtube.com/watch?v=${videoId}`;
            }
        }

        if (!title || !artist || !artwork) return null;
        return {
            title,
            artist,
            artwork,
            remaining,
            paused,
            url
        };
    };

    let lastDataStr = null;

    const update = () => {
        const data = extractData();
        if (!data) return;

        const dataStr = JSON.stringify(data);
        if (dataStr !== lastDataStr) {
            lastDataStr = dataStr;
            sendRPC(data);
        }
    };

    //✅ Detect video playback events and automatically trigger updates
    const bindVideoEvents = () => {
        const video = document.querySelector("video");
        if (!video) return;

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
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 🚀 Execute after the page is loaded
    window.addEventListener("load", () => {
        setTimeout(init, 1000);
    });
})();
