<div align="center">

# YT Music & YouTube Discord Rich Presence

<p>
  <strong>Auto-rich presence status based on what you play on YouTube or YT Music</strong>
</p>

![platform](https://img.shields.io/badge/Platform-Chrome%20%2F%20Discord-brightgreen?logo=googlechrome)
![tech](https://img.shields.io/badge/Built_with-Node.js-blue?logo=node.js)
![status](https://img.shields.io/badge/Status-Ready-success?logo=github)

</div>

---

## Features

- Automatically detect playback on:
  - [YouTube Music](https://music.youtube.com/)
  - [YouTube](https://www.youtube.com/)
  - [YouTube Shorts](https://www.youtube.com/shorts)
- Display elapsed and remaining time
- Show album art + play/pause icon
- Use `navigator.mediaSession` or `<video>` events
- Send to local RPC server → updates Discord presence
- One-click `.exe` packaging for background usage

---

## 🚀 Quick Start

<details>
<summary><strong>🔧 1. Setup Discord Application</strong></summary>

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Click **Rich Presence**
   - Upload 3 icons with keys:
     - `ytmusic`
     - `play_icon`
     - `pause_icon`
4. Copy your **Client ID**

</details>

<details>
<summary><strong>🧩 2. Install Chrome Extension</strong></summary>

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked** → select `/extension` folder
4. Open a YouTube / Music / Shorts page
5. You’ll see `✅ Sent Discord status` in DevTools Console

</details>

<details>
<summary><strong>🖥️ 3. Run RPC Server</strong></summary>

```bash
npm install
node rpc-server.js
```

**OR** run packaged executable:

```bash
ytmusic-rpc.exe
```

> This creates a local HTTP server on `http://localhost:3000`

</details>

---

## 📁 Project Structure

```bash
YoutubeStatusDiscord/
│
├─ rpc-server.js           # Main Node.js server
├─ install-service.js      # Optional Windows Service installer
├─ extension/              # Chrome extension source
│   ├─ manifest.json
│   ├─ content.js
│   └─ icon.png
└─ README.md
```

---

## 📊 Architecture Diagram

> 💡 If the diagram doesn't render, [click here to view image](https://github.com/yourname/yourrepo/blob/main/docs/diagram.png)

```mermaid
flowchart TB
    %% ==== External ====
    User((User)):::external
    Discord((Discord App)):::external
    YouTube((YouTube / YT Music)):::external

    %% ==== Extension ====
    subgraph BrowserExtension["Browser Extension (Chrome)"]
        direction TB
        Manifest["Manifest.json"]:::meta
        ContentScript["Content Script"]:::meta

        subgraph CSModules["Content Script Modules"]
            direction LR
            Extractor["Data Extractor"]:::script
            Events["Video Event Handler"]:::script
            RPC["RPC Client (Fetch)"]:::script
            DOMObserver["DOM Observer"]:::script
        end
    end

    %% ==== RPC Server ====
    subgraph RPCServer["Local RPC Server (Node.js)"]
        direction TB
        HTTP["HTTP Server"]:::http
        DiscordRPC["Discord RPC Client"]:::rpcclient

        subgraph RPCModules["RPC Modules"]
            direction LR
            CORS["CORS Handler"]:::http
            Processor["Data Processor"]:::logic
            Activity["Activity Manager"]:::logic
            Timestamp["Timestamp Manager"]:::logic
        end
    end

    %% ==== Flow Arrows ====
    User -->|"Uses"| YouTube
    YouTube -->|"Plays Media"| ContentScript

    ContentScript --> Manifest
    ContentScript --> Extractor
    ContentScript --> Events
    ContentScript --> RPC
    ContentScript --> DOMObserver

    Events --> Extractor
    Extractor --> RPC
    RPC -->|"Send Data"| HTTP

    HTTP --> CORS --> Processor --> Activity --> Timestamp
    Activity --> DiscordRPC -->|"Update Status"| Discord

    %% ==== Style Definitions ====
    classDef external fill:#e3f2fd,stroke:#1976d2,color:#0d47a1
    classDef meta fill:#f8f9fa,stroke:#6c757d,color:#343a40
    classDef script fill:#e8f0fe,stroke:#4285f4,color:#1a237e
    classDef http fill:#e8f5e9,stroke:#388e3c,color:#1b5e20
    classDef logic fill:#fff3e0,stroke:#f57c00,color:#e65100
    classDef rpcclient fill:#f3e5f5,stroke:#8e24aa,color:#4a148c
```

---

## ✅ Status Checklist

- [x] YouTube Music Support
- [x] YouTube video support
- [x] Shorts Support
- [x] Discord Status Icons/Buttons
- [x] Automatically crawl remaining time
- [x] Use video events to trigger updates (non-polling)
- [x] Can be packaged into .exe background program


---

## 🤝 Credits

Made by **TudoHuang**, powered by Node.js & Web Extension API.  
Discord Rich Presence is based on [`discord-rpc`](https://www.npmjs.com/package/discord-rpc)。
