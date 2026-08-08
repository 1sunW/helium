# 🎈 Helium

> **A refined, immersive hub for cinema, discovery, media streaming, and digital atmosphere.**

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## ✨ Overview

**Helium** is an all-in-one entertainment and digital portal built with precision typography, responsive fluid layouts, and smooth micro-interactions. Designed for fast media discovery, seamless video streaming, interactive gaming, and instant AI search assistance.

---

## 🚀 Key Features

- **🎬 Extensive Media Catalog**: Unblocked access to curated movies, TV shows, trending anime, books, manga, and music.
- **⚡ Built-In Video Player**: Integrated media preview modal supporting Google Drive embeds, external direct streams, and custom media servers.
- **🤖 Hydrogen AI Chat**: Integrated AI assistant with multi-model selection (GPT variants & DeepSeek reasoning models).
- **🔎 Onyx Web Search**: Seamlessly embedded search tab powered by Onyx for quick online queries.
- **🎮 Browser Gaming**: Built-in games hub featuring integrated Eaglercraft (Minecraft in browser) modal.
- **📚 Personal Library & Watchlists**: Save, mark as completed, rate, and review media synced via Firebase Firestore.
- **🎨 Custom Atmospheric Themes**: Fluid dark themes, custom accent highlights, and glowing backdrop aesthetics.
- **🔐 Admin Dashboard**: Content management panel for adding new titles, managing links, and moderating community updates.

---

## 🗂️ Categories & Navigation

| Category | Description |
| :--- | :--- |
| **🎬 Movies** | Latest blockbuster releases, indie gems, and high-rating films |
| **📺 TV Shows** | Episodic series, full season collections, and drama serials |
| **✨ Anime** | Popular seasonal anime, classics, and subbed/dubbed series |
| **🎮 Games** | Curated browser games & full Eaglercraft canvas integration |
| **🔍 Search** | Embedded Onyx web search portal for instant navigation |
| **🎵 Music** | Audio collections, chill beats, and listening playlists |
| **📚 Books & Manga**| Digital literature, light novels, and serialized manga |
| **💻 Hacks** | Educational developer resources, tools, and scripts |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Persistence**: [Firebase Authentication](https://firebase.google.com/docs/auth) & [Firestore Database](https://firebase.google.com/docs/firestore)
- **Runtime**: Node.js / Cloud Run containerized

---

## 🏁 Quickstart

### Prerequisites

- **Node.js**: v18+ 
- **npm** or **bun**

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/1sunw/heliumv2.git
cd heliumv2

# Install packages
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root if using custom Firebase or API keys:

```env
# Optional Firebase Credentials
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view Helium.

---

## 📁 Project Structure

```text
heliumv2/
├── src/
│   ├── components/         # Sub-components & HTML embeds (HydrogenChat, etc.)
│   ├── services/           # Firebase sync and movie services
│   ├── App.tsx             # Main application entry layout & router
│   ├── data.ts             # Curated media catalogs & static presets
│   ├── index.css           # Global Tailwind CSS imports
│   └── main.tsx            # React application root
├── firebase-blueprint.json # Firestore collection schemas
├── firestore.rules         # Security rules for database collections
├── index.html              # HTML entry point
├── metadata.json           # Application metadata & permissions
└── package.json            # Dependencies & scripts
```

---

## 💬 Community

Join the community on Discord for updates, requests, and feature suggestions:
- **Discord**: [Join Helium Discord](https://discord.gg/3KDAKzBDg4)

---

<p center align="center">
  Crafted with care for speed, atmosphere, and seamless media discovery.
</p>
