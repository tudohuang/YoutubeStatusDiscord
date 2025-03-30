// === rpc-server.js ===
// Local HTTP Server + Discord Rich Presence 更新
const http = require("http");
const RPC = require("discord-rpc");

const clientId = ""; // 你的 Discord application ID
const rpc = new RPC.Client({ transport: "ipc" });

let currentData = {};
let lastTitle = null;
let lastArtist = null;
let startTimestampFixed = null;

rpc.on("ready", () => {
  console.log("✅ Discord RPC connected");

  setInterval(() => {
    if (!currentData.title) return;

    const isPaused = currentData.paused === true;
    const smallImageKey = isPaused ? "pause_icon" : "play_icon";
    const smallImageText = isPaused ? "Paused" : "Played";

    if (
      currentData.title !== lastTitle ||
      currentData.artist !== lastArtist
    ) {
      startTimestampFixed = Date.now();
      lastTitle = currentData.title;
      lastArtist = currentData.artist;
    }

    const endTimestamp = (!isPaused && currentData.remaining && startTimestampFixed)
      ? startTimestampFixed + currentData.remaining * 1000
      : undefined;

    rpc.setActivity({
      details: `Playing：${currentData.title}`,
      state: `Singer：${currentData.artist}`,
      largeImageKey: currentData.artwork || "ytmusic",
      largeImageText: "YouTube Music",
      smallImageKey,
      smallImageText,
      startTimestamp: isPaused ? undefined : startTimestampFixed,
      endTimestamp,
      buttons: [
        {
          label: "Watch video",
          url: currentData.url || "https://music.youtube.com"
        }
      ]
    });
  }, 5000);
});

rpc.login({ clientId }).catch(console.error);

http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        currentData = JSON.parse(body);
        console.log("🎵 Received Song data：", currentData);
      } catch (e) {
        console.error("❌ JSON format Wrong：", e);
      }

      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      res.end("OK");
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}).listen(3000, () => {
  console.log("🌐 Local server listening on http://localhost:3000");
});
