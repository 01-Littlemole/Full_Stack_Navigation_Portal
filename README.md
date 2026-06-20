<div align="center">

[![中文](https://img.shields.io/badge/中文-README-red?style=for-the-badge)](./README.md)

<img src="https://img.shields.io/badge/Node.js-22?logo=nodedotjs&logoColor=fff&color=339933" />
<img src="https://img.shields.io/badge/Express-22?logo=express&logoColor=fff&color=000000" />
<img src="https://img.shields.io/badge/SQLite-22?logo=sqlite&logoColor=fff&color=003B57" />
<img src="https://img.shields.io/badge/EJS-22?logo=ejs&logoColor=fff&color=B4CA65" />
<img src="https://img.shields.io/badge/Session_Auth-22?logo=lock&logoColor=fff&color=4B32C3" />

<h1>Department Portal</h1>

<p>
  <strong>Full-Stack Navigation Portal</strong><br/>
  <sub>Node.js + Express + SQLite · Glassmorphism · Zero Config</sub>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## Introduction

A lightweight landing portal system. Glassmorphism navigation panel on the frontend, with an admin backend for login-protected management of site titles, navigation cards, and custom SVG icons. SQLite database requires zero configuration — start with a single command.

---

## Features

| Feature | Description |
|:---|:---|
| Authentication | Session-based auth with bcrypt password hashing |
| Dynamic Editing | Edit site title & subtitle in admin, instant live update |
| Card Management | Add / delete / edit navigation cards with sort order |
| Icon Presets | 20 built-in SVG icons, one-click selection |
| Custom SVG | Paste any SVG code with real-time preview |
| 6 Color Themes | Blue / Teal / Purple / Orange / Red / Green |
| Responsive | 6 → 4 → 2 column auto-adapt, mobile-friendly |
| Glassmorphism | Frosted glass effect with gradient background |
| Zero Config | SQLite auto-creates database and tables on first run |
| Text Marquee | Card names auto-scroll when exceeding container width |

---

## Architecture

```mermaid
flowchart TB
    subgraph Browser["Browser"]
        Landing["Landing Page"]
        Admin["Admin Panel"]
    end

    subgraph Server["Express Server"]
        Auth["Auth Middleware<br/>Session + bcrypt"]
        Routes["Routes"]
        EJS["EJS Templates"]
    end

    subgraph Database["SQLite"]
        Users["users"]
        Settings["settings"]
        Cards["cards"]
    end

    Landing --> Routes
    Admin --> Auth
    Auth --> Routes
    Routes --> EJS
    Routes --> Database
    EJS --> Landing
    EJS --> Admin

    style Browser fill:#e8f4fd,stroke:#2f78ff,color:#0d1b38
    style Server fill:#fff8e1,stroke:#f1a625,color:#0d1b38
    style Database fill:#e8f5e9,stroke:#24ae86,color:#0d1b38
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start server
node server.js
```

| URL | Page |
|:---|:---|
| `http://localhost:3000` | Landing Page |
| `http://localhost:3000/admin` | Admin Panel |

**Default Account**

| Username | Password |
|:---|:---|
| `admin` | `admin123` |

> On first run, `data/portal.db` is auto-created with 12 preset navigation cards.

---

## Project Structure

```
department-portal/
├── server.js              # Express entry point
├── db.js                  # DB init & seed data
├── auth.js                # Auth middleware
├── package.json           # Dependencies
├── views/
│   ├── index.ejs          # Landing page
│   └── admin/
│       ├── _header.ejs    # Shared admin navbar
│       ├── login.ejs      # Login page
│       ├── dashboard.ejs  # Dashboard
│       ├── settings.ejs   # Site settings
│       └── cards.ejs      # Card management
├── public/
│   └── admin.css          # Admin styles
├── data/
│   └── portal.db          # SQLite database (auto-generated)
├── .gitignore
├── README.md
└── README_EN.md
```

---

## Database

| Table | Fields | Description |
|:---|:---|:---|
| `users` | id, username, password_hash | Admin accounts |
| `settings` | key, value | Key-value config |
| `cards` | id, title, icon_svg, icon_color, link_url, sort_order | Navigation cards |

---

## Routes

| Method | Path | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/` | — | Landing page |
| `GET` | `/admin/login` | — | Login page |
| `POST` | `/admin/login` | — | Login action |
| `GET` | `/admin/logout` | — | Logout |
| `GET` | `/admin` | ✅ | Dashboard |
| `GET/POST` | `/admin/settings` | ✅ | Site settings |
| `GET/POST` | `/admin/cards` | ✅ | Card CRUD |
| `POST` | `/admin/cards/:id/update` | ✅ | Update card |
| `POST` | `/admin/cards/:id/delete` | ✅ | Delete card |

---

## Tech Choices

| Layer | Choice | Why |
|:---|:---|:---|
| Runtime | **Node.js** | Lightweight, vast ecosystem |
| Framework | **Express** | Minimal, intuitive routing |
| Template | **EJS** | HTML-like syntax, zero learning curve |
| Database | **SQLite + better-sqlite3** | Single file, no install, sync API |
| Auth | **express-session + bcryptjs** | Session persistence, secure hashing |
| UI | **Glassmorphism** | Modern frosted glass aesthetic |

---

## Preview

```
┌──────────────────────────────────────────────────────┐
│  🔔 Notifications    👤 Welcome                       │
│  ┌────┐  Department Portal                            │
│  │ 🏛 │  Unified Navigation Platform                   │
│  └────┘                                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│   │ 📁   │ │ 🎓   │ │ 👥   │ │ 💰   │ │ 📦   │ │ 🗄️   │ │
│   │Office │ │Edu   │ │HR    │ │Finance│ │Assets │ │Data   │ │
│   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│   │ 📢   │ │ 📅   │ │ 🧪   │ │ 🏢   │ │ 📂   │ │ 🌐   │ │
│   │Notice │ │Meeting│ │Lab    │ │Facility│ │Archive│ │Portal │ │
│   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
├──────────────────────────────────────────────────────┤
│     🛡️ Secure · Standard · Efficient · Service  | © 2024 │
└──────────────────────────────────────────────────────┘
```

---

<div align="center">

## License

MIT · Free to use, modify, and distribute.

</div>
